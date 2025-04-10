"use client";

import React from "react";
import { Eye } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Icon } from "@acme/ui/icon";

import { useShowAnnotationLayer } from "./annotation-layer";

export const AnnotationShowButton = () => {
  const [showAnnotationLayer, setShowAnnotationLayer] =
    useShowAnnotationLayer();
  return (
    <Button
      variant="outline"
      onClick={() => setShowAnnotationLayer(!showAnnotationLayer)}
    >
      Annotate video <Icon as={Eye} />
    </Button>
  );
};
