import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import slugify from "slugify"; // npm install slugify

// Define attributes
interface CategoryAttributes {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Some fields optional when creating
interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id" | "slug" | "description"> {}

// Model class
class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public name!: string;
  public slug!: string;
  public description?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize model
Category.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      // unique: true,
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      // unique: true,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "categories",
    modelName: "Category",
    timestamps: true,
    hooks: {
      beforeValidate: (category) => {
        if (!category.slug && category.name) {
          category.slug = slugify(category.name, { lower: true, strict: true });
        }
      },
    },
  }
);

export default Category;
