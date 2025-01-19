"use client";
import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { useState } from "react";

const bcolorInputDark = "#0e0025";
const bcolorInputLight = "#fff";
const TextFieldStyledPassword = styled(TextField)<TextFieldProps>(
  ({ theme }) => {
    return {
      "& .MuiFormLabel-root": {
        fontWeight: 500,
      },
      //styled cho input
      "& .MuiInputBase-input.MuiOutlinedInput-input": {
        //phan nay khac so voi user con dau giong het, tac dung la tat cai border phai cua input password
        borderTopRightRadius: "unset",
        borderBottomRightRadius: "unset",
      },
      "[data-mui-color-scheme='light'] & .MuiInputBase-input.MuiOutlinedInput-input":
        {
          WebkitBoxShadow: `0 0 0 100px ${bcolorInputLight} inset `,
          borderRight: "unset",
        },
      "[data-mui-color-scheme='dark'] & .MuiInputBase-input.MuiOutlinedInput-input":
        {
          WebkitBoxShadow: `0 0 0 100px ${bcolorInputDark} inset `,
          borderRight: "unset",
        },
      //styled cho the div boc ngoai o input (bao gom ca icon hidden password)
      "[data-mui-color-scheme='dark'] & .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary":
        {
          backgroundColor: `${bcolorInputDark}`,
          overflow: "hidden",
        },
      "[data-mui-color-scheme='light'] & .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary":
        {
          backgroundColor: `${bcolorInputLight}`,
          overflow: "hidden",
        },
    };
  }
);
const TextFieldStyledUsername = styled(TextField)<TextFieldProps>(
  ({ theme }) => {
    return {
      "& .MuiFormLabel-root": {
        fontWeight: 500,
      },
      //styled cho input
      "[data-mui-color-scheme='dark'] & .MuiInputBase-input.MuiOutlinedInput-input":
        {
          WebkitBoxShadow: `0 0 0 100px ${bcolorInputDark} inset `,
          borderRight: "unset",
        },
      "[data-mui-color-scheme='light'] & .MuiInputBase-input.MuiOutlinedInput-input":
        {
          WebkitBoxShadow: `0 0 0 100px ${bcolorInputLight} inset `,
          borderRight: "unset",
        },
      //styled cho the div boc ngoai o input (bao gom ca icon hidden password)
      "[data-mui-color-scheme='dark'] & .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary":
        {
          backgroundColor: `${bcolorInputDark}`,
          overflow: "hidden",
        },
      "[data-mui-color-scheme='light'] & .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary":
        {
          backgroundColor: `${bcolorInputLight}`,
          overflow: "hidden",
        },
    };
  }
);
export const CustomTextFieldPassword = (props: TextFieldProps) => {
  const [labelActive, setLabelActive] = useState<boolean>(true);
  const {
    size = "small",
    InputLabelProps,
    variant = "filled",
    ...rests
  } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setLabelActive(true);
    } else {
      setLabelActive(false);
    }
  };
  return (
    <TextFieldStyledPassword
      size={size}
      variant={variant}
      InputLabelProps={{ ...InputLabelProps, shrink: labelActive }}
      {...rests}
      onChange={handleChange}
    />
  );
};
export const CustomTextFieldUsername = (props: TextFieldProps) => {
  const [labelActive, setLabelActive] = useState<boolean>(true);
  const {
    size = "small",
    InputLabelProps,
    variant = "filled",
    ...rests
  } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setLabelActive(true);
    } else {
      setLabelActive(false);
    }
  };
  return (
    <TextFieldStyledUsername
      size={size}
      variant={variant}
      InputLabelProps={{ ...InputLabelProps, shrink: labelActive }}
      {...rests}
      onChange={handleChange}
    />
  );
};
