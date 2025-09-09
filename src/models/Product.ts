import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Category from "./Category";

interface ProductAttributes {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  images?: string[]; // array of image URLs
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  specifications?: { key: string; value: string }[]; // array of objects
  addons?: { name: string; price: number }[]; // array of objects
  categoryId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes
  extends Optional<
    ProductAttributes,
    | "id"
    | "slug"
    | "discountPrice"
    | "images"
    | "seoTitle"
    | "seoDescription"
    | "seoKeywords"
    | "specifications"
    | "addons"
  > {}

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public slug!: string;
  public description?: string;
  public price!: number;
  public discountPrice?: number;
  public stock!: number;
  public sku!: string;
  public images?: string[];
  public seoTitle?: string;
  public seoDescription?: string;
  public seoKeywords?: string;
  public specifications?: { key: string; value: string }[];
  public addons?: { name: string; price: number }[];
  public categoryId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    seoTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seoDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seoKeywords: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    specifications: {
      type: DataTypes.JSON, // [{ key: "RAM", value: "16GB" }, ...]
      allowNull: true,
    },
    addons: {
      type: DataTypes.JSON, // [{ name: "Warranty", price: 99.99 }, ...]
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "products",
    timestamps: true,
  }
);

// 🔗 Associations
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

export default Product;
