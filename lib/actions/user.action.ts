"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  UpdateUserParams,
  DeleteUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function getUserById(params: any) {
  try {
    // take this func from "mongese.ts" file o 'lib/mongoose.ts'
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    // take this func from "mongese.ts" file o 'lib/mongoose.ts'
    connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    // take this func from "mongese.ts" file o 'lib/mongoose.ts'
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    // take this func from "mongese.ts" file o 'lib/mongoose.ts'
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // if user exists we have to delete all data related to this user
    // 1. get all questions' IDs of this user
    const userQuestionsIds = await Question.find({ author: user._id }).distinct(
      "_id"
    );
    // delete all questions of this user
    await Question.deleteMany({ author: user._id });

    // TODO: delete all answers, comments, etc. of this user

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
