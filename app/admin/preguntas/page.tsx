"use client";
import { useEffect } from "react";
export default function RetiredQuestionsPage(){
  useEffect(() => { window.location.replace("/admin/"); }, []);
  return <main><a href="/admin/">Volver al panel general</a></main>;
}
