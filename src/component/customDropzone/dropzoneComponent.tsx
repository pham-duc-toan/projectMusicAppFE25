"use client";

import React from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { styled } from "@mui/material/styles";
import { Box, Button } from "@mui/material";
import { useTranslations } from "next-intl";

const bcolorLight = "#ffffff";
const bcolorDark = "#1b0c35";
const textLight = "#9A52A0";
const textDark = "#fff";
const bcolorFocus = "#655BD3";

const DropzoneContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: "50px",
  borderWidth: "2px",
  borderRadius: "2px",
  borderStyle: "dashed",
  outline: "none",
  transition: "border 0.24s ease-in-out",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "&:focus": {
    borderColor: `${bcolorFocus}`,
  },
  "[data-mui-color-scheme='light'] &": {
    backgroundColor: `${bcolorLight}`,
    color: `${textLight}`,
    borderColor: `${textLight}`,
    "MuiButtonBase-root": {
      color: `${textLight}`,
    },
  },
  "[data-mui-color-scheme='dark'] &": {
    backgroundColor: `${bcolorDark}`,
    color: `${textDark}`,
    borderColor: `${textDark}`,
    ".MuiButtonBase-root": {
      color: `${textDark}`,
      border: `1px solid  ${textDark}`,
    },
  },
}));

interface DropzoneComponentProps {
  onDrop: (acceptedFiles: FileWithPath[]) => void;
}

const DropzoneComponent: React.FC<DropzoneComponentProps> = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [], "audio/*": [] },
  });
  const t = useTranslations("dropzone");
  return (
    <DropzoneContainer {...getRootProps()}>
      <input {...getInputProps()} />
      <Button variant="outlined">{t("dragAndDrop")}</Button>
    </DropzoneContainer>
  );
};

export default DropzoneComponent;
