import { Request, Response } from "express";
import slugify from "slugify";
import Category from "../models/Category";
import { Op } from "sequelize";

// ✅ Create category
const createCategory = async (req: Request, res: Response) => {
  console.log("api call")
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existingCategory = await Category.findOne({ where: { slug } });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, slug, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get all categories
const getCategories = async (req: Request, res: Response) => {
  try {
    // Get pagination params (default: page=1, limit=10)
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "10", 10);
    const offset = (page - 1) * limit;

    // Get search query
    const search = (req.query.search as string) || "";

    // Build search condition
    const whereCondition = search
      ? { name: { [Op.like]: `%${search}%` } } // replace 'name' with your column
      : {};

    // Fetch with pagination + search
    const { count, rows: categories } = await Category.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["createdAt", "DESC"]], // optional sort
    });

    res.status(200).json({
      data: categories,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// ✅ Get category by ID
const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update category
const updateCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body || {};
  
  const { id } = req.params;
  console.log(req.body, "this is do")
  try {
    console.log("api call")
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Regenerate slug only if name changes
    if (req.body.name && req.body.name !== category.name) {
      category.slug = slugify(name, { lower: true, strict: true });
      category.name = req.body.name;
    }

    if (req.body.description !== undefined) {
      category.description = req.body.description;
    }

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete category
const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export {
  createCategory,
  updateCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
};
