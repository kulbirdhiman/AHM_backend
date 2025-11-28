import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User"; // assuming you have a User model
import Product from "./Product";

interface OrderAttributes {
  id: number;
  userId: number; // customer
  products: { productId: number; quantity: number; price: number }[]; // array of products in the order
  totalAmount: number;
  paymentStatus: "pending" | "completed" | "failed";
  shippingAddress: string;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderCreationAttributes
  extends Optional<OrderAttributes, "id" | "paymentStatus" | "orderStatus"> {}

class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number;
  public userId!: number;
  public products!: { productId: number; quantity: number; price: number }[];
  public totalAmount!: number;
  public paymentStatus!: "pending" | "completed" | "failed";
  public shippingAddress!: string;
  public orderStatus!: "pending" | "processing" | "shipped" | "delivered" | "cancelled";

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    products: {
      type: DataTypes.JSON, // store productId, quantity, price
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
    shippingAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orderStatus: {
      type: DataTypes.ENUM(
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: true,
  }
);

// 🔗 Associations
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Order;
