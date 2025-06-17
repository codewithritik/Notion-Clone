const Page = require("../../models/page.model");
const Version = require("../../models/version.model");
const Workspace = require("../../models/workspace.model");
const { callOpenAI } = require("../../services/openai.service");
const {
  processPageContent,
  removePageEmbedding,
} = require("../../services/embedding.service");
const { getLinkSuggestions } = require("../../services/autolink.service");
const { NotFoundError, ForbiddenError } = require("../utils/errors");

const pageController = {
  // Create a new page
  async createPage(req, res) {
    const { title, content, workspaceId } = req.body;
    const userId = req.auth.id;

    // // Check if user has access to workspace
    // const workspace = await Workspace.findOne({
    //   _id: workspaceId,
    //   'members.userId': userId
    // });

    // if (!workspace) {
    //   throw new NotFoundError('Workspace not found or insufficient permissions');
    // }

    const page = await Page.create({
      title,
      content,
      workspaceId,
      userId,
      createdBy: userId,
      updatedBy: userId,
    });

    // Create initial version
    await Version.create({
      pageId: page._id,
      content,
      createdBy: userId,
    });

    // Process content for embeddings (silently)
    try {
      await processPageContent(page._id, workspaceId, content, {
        title,
        createdBy: userId,
      });
    } catch (error) {
      console.error("Error processing embeddings for new page:", error);
      // Don't fail the request if embedding fails
    }

    res.status(201).json(page);
  },

  // Get all pages in workspace
  async getWorkspacePages(req, res) {
    const { workspaceId } = req.params;
    const userId = req.auth.id;

    // Check if user has access to workspace
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.userId": userId,
    });

    if (!workspace) {
      throw new NotFoundError(
        "Workspace not found or insufficient permissions"
      );
    }

    const pages = await Page.find({ workspaceId })
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    res.json(pages);
  },

  // Get page by ID
  async getPageById(req, res) {
    const { pageId } = req.params;
    const userId = req.auth.id;

    const page = await Page.findById(pageId)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!page) {
      throw new NotFoundError("Page not found");
    }

    // Check if user has access to workspace
    const workspace = await Workspace.findOne({
      _id: page.workspaceId,
      "members.userId": userId,
    });

    if (!workspace) {
      throw new NotFoundError(
        "Workspace not found or insufficient permissions"
      );
    }

    res.json(page);
  },

  // Update page
  async updatePage(req, res) {
    const { pageId } = req.params;
    const { title, content } = req.body;
    const userId = req.auth.id;

    const page = await Page.findById(pageId);

    if (!page) {
      throw new NotFoundError("Page not found");
    }

    // Check if user has edit permissions
    const workspace = await Workspace.findOne({
      _id: page.workspaceId,
      "members.userId": userId,
      "members.role": { $in: ["owner", "editor"] },
    });

    if (!workspace) {
      throw new NotFoundError(
        "Workspace not found or insufficient permissions"
      );
    }

    // Create new version if content changed
    if (content && JSON.stringify(content) !== JSON.stringify(page.content)) {
      await Version.create({
        pageId: page._id,
        content,
        createdBy: userId,
      });
      // Extract only the text content from the TipTap JSON structure
      const extractTextContent = (node) => {
        if (node.type === "text") {
          return node.text;
        }
        if (node.content) {
          return node.content.map(extractTextContent).join("");
        }
        return "";
      };

      const userContent = content.content ? extractTextContent(content) : "";

      // Process content for embeddings (silently)
      try {
        await processPageContent(page._id, page.workspaceId, userContent, {
          title: title || page.title,
          updatedBy: userId,
        });
      } catch (error) {
        console.error("Error processing embeddings for updated page:", error);
        // Don't fail the request if embedding fails
      }
    }

    page.title = title || page.title;
    page.content = content || page.content;
    page.updatedBy = userId;
    await page.save();

    try {
      // Extract only the text content from the TipTap JSON structure
      const extractTextContent = (node) => {
        if (node.type === "text") {
          return node.text;
        }
        if (node.content) {
          return node.content.map(extractTextContent).join("");
        }
        return "";
      };

      const userContent = content.content ? extractTextContent(content) : "";

      const response = await callOpenAI({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a tagging engine. Extract the most relevant topic tags based on the content provided by the user
Return only a comma-separated list of 3–8 concise lowercase tags (single words or short phrases). No sentences, no explanations, no extra words. If no relevant tags are found, return an empty string.
`,
          },
          { role: "user", content: userContent },
        ],
      });

      const tagString = response.choices[0].message.content;
      const tags = tagString
      .toLowerCase()
      .split(",")
      .map(t => t.trim())
      .filter(tag => /^[a-z0-9\s-]{2,40}$/.test(tag));

      // await updatePageTags(pageId, tags);

      // Send combined response with both page data and tags
      res.json({
        ...page.toObject(),
        tags,
      });
    } catch (err) {
      console.error("Auto-tagging failed:", err);
      // Still return the page data even if tagging fails
      res.json(page);
    }
  },

  // Delete page
  async deletePage(req, res) {
    const { pageId } = req.params;
    const userId = req.auth.id;

    const page = await Page.findById(pageId);

    if (!page) {
      throw new NotFoundError("Page not found");
    }

    // Check if user has edit permissions
    const workspace = await Workspace.findOne({
      _id: page.workspaceId,
      "members.userId": userId,
      "members.role": { $in: ["owner", "editor"] },
    });

    if (!workspace) {
      throw new NotFoundError(
        "Workspace not found or insufficient permissions"
      );
    }

    // Delete all versions
    await Version.deleteMany({ pageId });

    // Remove embeddings (silently)
    try {
      await removePageEmbedding(pageId);
    } catch (error) {
      console.error("Error removing page embeddings:", error);
      // Don't fail the request if embedding removal fails
    }

    await page.remove();

    res.status(204).send();
  },

  // Move page
  async movePage(req, res) {
    const { pageId } = req.params;
    const { parentId, position } = req.body;
    const userId = req.auth.id;

    const page = await Page.findById(pageId);

    if (!page) {
      throw new NotFoundError("Page not found");
    }

    // Check if user has edit permissions
    const workspace = await Workspace.findOne({
      _id: page.workspaceId,
      "members.userId": userId,
      "members.role": { $in: ["owner", "editor"] },
    });

    if (!workspace) {
      throw new NotFoundError(
        "Workspace not found or insufficient permissions"
      );
    }

    page.parentId = parentId;
    await page.save();

    res.json(page);
  },

  // Get page history
  async getPageHistory(req, res) {
    const { pageId } = req.params;
    const userId = req.auth.id;

    const page = await Page.findById(pageId);

    if (!page) {
      throw new NotFoundError("Page not found");
    }

    // Check if user has access to workspace
    const workspace = await Workspace.findOne({
      _id: page.workspaceId,
      "members.userId": userId,
    });

    if (!workspace) {
      throw new NotFoundError(
        "Workspace not found or insufficient permissions"
      );
    }

    const versions = await Version.find({ pageId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(versions);
  },

  // Restore page version
  async restorePageVersion(req, res) {
    const { pageId, versionId } = req.params;
    const userId = req.auth.id;

    const page = await Page.findById(pageId);

    if (!page) {
      throw new NotFoundError("Page not found");
    }

    // Check if user has edit permissions
    const workspace = await Workspace.findOne({
      _id: page.workspaceId,
      "members.userId": userId,
      "members.role": { $in: ["owner", "editor"] },
    });

    if (!workspace) {
      throw new NotFoundError(
        "Workspace not found or insufficient permissions"
      );
    }

    const version = await Version.findById(versionId);

    if (!version) {
      throw new NotFoundError("Version not found");
    }

    // Create new version with restored content
    await Version.create({
      pageId: page._id,
      content: version.content,
      createdBy: userId,
    });

    page.content = version.content;
    page.updatedBy = userId;
    await page.save();

    res.json(page);
  },

  // Add tag to page
  async addTagToPage(req, res) {
    const { pageId } = req.params;
    const { tag } = req.body;
    const userId = req.auth.id;

    const page = await Page.findById(pageId);

    if (!page) {
      throw new NotFoundError("Page not found");
    }

    // Check if user has edit permissions
    const workspace = await Workspace.findOne({
      _id: page.workspaceId,
      "members.userId": userId,
      "members.role": { $in: ["owner", "editor"] },
    });

    if (!workspace) {
      throw new NotFoundError(
        "Workspace not found or insufficient permissions"
      );
    }

    // Add tag if it doesn't exist
    if (!page.tags.includes(tag)) {
      page.tags.push(tag);
      page.updatedBy = userId;
      await page.save();
    }

    res.json(page);
  },

  // Get link suggestions for content
  async getLinkSuggestions(req, res) {
    const { workspaceId } = req.params;
    const { text } = req.body;
    const userId = req.auth.id;

    // Check if user has access to workspace
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.userId": userId,
    });

    if (!workspace) {
      throw new NotFoundError(
        "Workspace not found or insufficient permissions"
      );
    }

    try {
      const suggestions = await getLinkSuggestions(text, workspaceId);
      res.json(suggestions);
    } catch (error) {
      console.error("Error getting link suggestions:", error);
      res.status(500).json({ error: "Failed to get link suggestions" });
    }
  },
};

module.exports = pageController;
