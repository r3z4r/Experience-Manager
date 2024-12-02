"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { defaultTemplate } from "@/app/(frontend)/api/templates/default/route";
import { PageData } from "@/app/(frontend)/_lib/api";
import { toast } from "sonner";

export function TemplateList() {
  const router = useRouter();
  const [pages, setPages] = useState<PageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/templates");
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePage = async () => {
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "New Page",
          description: "Page description",
          html: defaultTemplate.html,
          css: defaultTemplate.css,
        }),
      });

      const newPage = await response.json();
      if (newPage?.doc?.id) {
        if (newPage?.message) toast.success(newPage.message);
        router.push(`/editor/${newPage.doc.id}`);
      } else if (newPage?.errors) {
        newPage.errors.forEach(({ message }: { message: string }) => {
          toast.error(message);
        });
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error creating page:", error);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {isLoading ? (
          <div>Loading pages...</div>
        ) : Array.isArray(pages) && pages.length > 0 ? (
          <>
            {pages.map((page) => (
              <div
                key={page.id}
                className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">{page.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{page.description}</p>
                <div className="flex gap-2">
                  <Link
                    href={`/editor/${page.id}`}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/preview/${page.id}`}
                    className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            ))}
            <button
              onClick={handleCreatePage}
              className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center hover:bg-gray-50"
            >
              <div className="text-center">
                <PlusIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <span className="text-gray-600">Create New Page</span>
              </div>
            </button>
          </>
        ) : (
          <div className="col-span-full text-center p-8">
            <div className="mx-auto max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No pages found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first page template
              </p>
              <button
                onClick={handleCreatePage}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create First Page
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
