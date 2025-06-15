export function ResumeBuilderPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-4">Resume Builder</h1>
          <p className="text-muted-foreground">Create your professional resume with our integrated builder</p>
        </div>
        
        <div className="w-full">
          <iframe 
            src="https://rxresu.me" 
            width="100%" 
            height="800px" 
            style={{border: 'none'}}
            title="Resume Builder"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}