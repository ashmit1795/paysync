import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		name: v.string(),
		email: v.string(),
		tokenIdentifier: v.string(),
		imageUrl: v.optional(v.string()),
	})
		.index("by_token", ["tokenIdentifier"])
		.index("by_email", ["email"])
		.searchIndex("search_name", { searchField: "name" })
		.searchIndex("search_email", { searchField: "email" }),

	expenses: defineTable({
		description: v.string(),
		amount: v.number(),
		category: v.optional(v.string()),
		date: v.number(), // timestamp
		paidByUserId: v.id("users"), // User who paid for the expense, referencing the users table
		splitType: v.string(), // e.g., "equal", "percentage", "exact"
		splits: v.array(
			v.object({
				userId: v.id("users"), // User who is part of the split, referencing the users table
				amount: v.number(), // Amount owed by the user
				paid: v.boolean(), // Whether the user has paid their share
			})
		),
		groupId: v.optional(v.id("groups")), // undefined for one-on-one expenses
		createdBy: v.id("users"), // User who created the expense, referencing the users table
	})
		.index("by_user_and_group", ["paidByUserId", "groupId"])
		.index("by_group", ["groupId"])
		.index("by_date", ["date"])
		.searchIndex("search_description", { searchField: "description" }),

	groups: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		createdBy: v.id("users"), // User who created the group, referencing the users table
		members: v.array(
			v.object({
				userId: v.id("users"), // User who is a member of the group, referencing the users table
				role: v.string(), // e.g., "admin", "member",
				joinedAt: v.number(), // timestamp of when the user joined the group
			})
		), // Array of user IDs who are members of the group
	}),

	settlements: defineTable({
		amount: v.number(),
		date: v.number(), // timestamp
		paidByUserId: v.id("users"), // User who made the settlement, referencing the users table
		receivedByUserId: v.id("users"), // User who received the settlement, referencing the users table
		groupId: v.optional(v.id("groups")), // Group for which the settlement was made, if applicable -- undefined for one-on-one settlements
        relatedExpenseId: v.optional(v.array(v.id("expenses"))), // Related expense ID, if applicable
        createdBy: v.id("users"), // User who created the settlement, referencing the users table
    }).index("by_user_and_group", ["paidByUserId", "groupId"])
        .index("by_group", ["groupId"])
        .index("by_date", ["date"])
        .index("by_receiver_and_group", ["receivedByUserId", "groupId"])
});