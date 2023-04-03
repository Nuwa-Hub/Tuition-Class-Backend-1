import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { UserLoginInput } from "../dto";
import { User } from "../models";
import { Role } from "../utility/constants";

import { GenerateSignature, ValidatePassword } from "../utility";

export const AdminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(UserLoginInput, req.body);

  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const { email, password } = customerInputs;
  const user = await User.findOne({ email });
  if (user && user?.role === Role.Admin) {
    const validation = await ValidatePassword(
      password,
      user.password,
      user.salt
    );

    if (validation) {
      const signature = await GenerateSignature({
        _id: user._id,
        phone: user.phone,
        role: user.role,
      });

      return res.status(200).json({
        signature,
        phone: user.phone,
        id: user._id,
      });
    }
  }

  return res.status(401).json({ msg: "Invalid Credentials" });
};

export const GetStudentProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user && user.role === Role.Admin) {
      const profiles = await User.find({ role: Role.Student });

      if (profiles) {
        return res.status(200).json(profiles);
      }
    }
    return res.status(400).json({ msg: "Error while Fetching Profiles" });
  } catch (error) {
    console.log("err", error);
    return res.sendStatus(500);
  }
};

export const GetStudentCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user && user.role === Role.Admin) {
      const count = await User.find({ role: Role.Student }).count();

      if (count >= 0) {
        return res.status(200).json(count);
      }
    }
    return res.status(400).json({ msg: "Error while Fetching Profiles" });
  } catch (error) {
    console.log("err", error);
    return res.sendStatus(500);
  }
};

export const GetStudentProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  if (id) {
    const profile = await User.findById(id);

    if (profile) {
      return res.status(200).json(profile);
    }
  }
  return res.status(400).json({ msg: "Error while Fetching Profile" });
};

// Approve Student

export const ApproveStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { _id, approval } = req.body;

    if (user && user.role === Role.Admin) {
      const profile = await User.findOneAndUpdate(
        { _id: _id },
        { $set: { paid: approval } }
      );

      if (profile) {
        return res.status(200).json(profile);
      }
    }
    return res.status(400).json({ msg: "Error while updating Profile" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// check slip

export const CheckSlip = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { id } = req.body;

    if (user && user.role === Role.Admin) {
      const profile = await User.findOneAndUpdate(
        { _id: id },
        { $set: { checked: true } }
      );

      if (profile) {
        return res.status(200).json(profile);
      }
    }
    return res.status(400).json({ msg: "Error while updating Profile" });
  } catch (error) {
    return res.sendStatus(500);
  }
};

// delete user

export const DeleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (user && user.role === Role.Admin) {
      const profile = await User.findOneAndDelete({ _id: id });

      if (profile) {
        return res.status(200).json(profile);
      }
    }
    return res.status(400).json({ msg: "Error while Deleting Profile" });
  } catch (error) {
    return res.sendStatus(500);
  }
};