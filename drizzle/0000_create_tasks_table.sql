CREATE TYPE "public"."task_status" AS ENUM('in progress', 'to do', 'completed');--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"status" "task_status",
	"description" text,
	"time_estimation" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
