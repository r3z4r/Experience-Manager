import Editor from "@/app/(frontend)/Xmanager/Editor";

interface LandingEditorProps {
  params: {
    id?: string;
  };
  searchParams: {
    mode?: "edit" | "view";
  };
}

const LandingEditor = ({ params, searchParams }: LandingEditorProps) => {
  return <Editor templateId={params.id} mode={searchParams.mode || "edit"} />;
};

export default LandingEditor;
