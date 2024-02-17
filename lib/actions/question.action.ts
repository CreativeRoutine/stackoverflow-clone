"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import { revalidatePath } from "next/cache";

// Here in this function, we are creating a question and adding tags to it.
// We are also creating the tags if they don't exist in the database.
// We are also updating the tags with the question id.
// This is a very complex function and it is not easy to understand.
// This is because we are not using the right tools for the job.
// We are using a relational database to store data that is not relational.

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const questions = await Question.find({})
      .sort({ createdAt: -1 })
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User });

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // Create the tags or get them from the database
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        // find a tag with the same name
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        //  if it exists, push the question id to the questions array
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        // if it doesn't exist, create a new tag
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    // update the question with the tags
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // Create an interaction record for the user's ask_question action

    // Increment author's reputation by +5 for asking a question

    revalidatePath(path);
  } catch (error) {}
}
