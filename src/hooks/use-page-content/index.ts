import { PageContentContext } from "@/providers/page-content";
import { useContext } from "react";

export const usePageContentContext = () => useContext(PageContentContext);
