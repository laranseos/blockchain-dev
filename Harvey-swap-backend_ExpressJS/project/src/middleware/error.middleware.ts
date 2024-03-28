import { ApiError } from "@/types/interfaces/interfaces.common";
import { Request, Response, NextFunction } from "express";

// @desc Handles error responses from throw errors

export const errorResponse = (error: ApiError, _req: Request, res: Response, _next: NextFunction) => {
   console.log(error);
   res.status(500).json({
      success: false,
      data: error,
      message: error.message,
   });
};