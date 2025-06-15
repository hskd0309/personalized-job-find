export function ResumeBuilderPage() {
  return (
    <div className="w-full h-screen">
      <iframe 
        src="https://your-deploy-url" 
        width="100%" 
        height="100%"
        style={{border:'none'}}
        className="w-full h-full"
      />
    </div>
  );
}