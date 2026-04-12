import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";

interface LeakItem {
  id: number;
  image: string | null;
  description: string;
}

const LeaksDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = (location.state as { role?: string })?.role;
  const isOwner = role === "owner";

  const [items, setItems] = useState<LeakItem[]>([]);
  const [victims, setVictims] = useState("");
  const [nextId, setNextId] = useState(1);

  // Redirect if no valid role
  if (!role || (role !== "viewer" && role !== "owner")) {
    navigate("/leaks");
    return null;
  }

  const addItem = () => {
    setItems([...items, { id: nextId, image: null, description: "" }]);
    setNextId(nextId + 1);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleImageUpload = (id: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setItems(items.map((i) => (i.id === id ? { ...i, image: e.target?.result as string } : i)));
    };
    reader.readAsDataURL(file);
  };

  const updateDescription = (id: number, desc: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, description: desc } : i)));
  };

  return (
    <div className="scanlines flicker min-h-screen p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate("/home")} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 cursor-pointer">
          <ArrowLeft size={16} /> BACK
        </button>
        <span className="text-muted-foreground text-xs tracking-wider border border-border px-3 py-1">
          {isOwner ? "OWNER ACCESS" : "VIEWER ACCESS"}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* Main content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-primary text-2xl tracking-widest" style={{ textShadow: "0 0 10px hsl(0 100% 50% / 0.5)" }}>
              LEAKS
            </h1>
            {isOwner && (
              <button onClick={addItem} className="red-box p-2 hover:text-primary transition-colors cursor-pointer flex items-center gap-2 px-4">
                <Plus size={16} /> ADD
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.id} className="red-box p-4 relative group">
                {isOwner && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}

                {item.image ? (
                  <img src={item.image} alt="" className="w-full h-48 object-cover mb-3 border border-border" />
                ) : isOwner ? (
                  <label className="flex items-center justify-center w-full h-48 border border-dashed border-border cursor-pointer hover:border-primary transition-colors mb-3">
                    <span className="text-muted-foreground text-sm tracking-wider">UPLOAD IMAGE</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImageUpload(item.id, f);
                      }}
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-center w-full h-48 border border-dashed border-border mb-3">
                    <span className="text-muted-foreground text-sm tracking-wider">NO IMAGE</span>
                  </div>
                )}

                {isOwner ? (
                  <input
                    type="text"
                    placeholder="Description..."
                    value={item.description}
                    onChange={(e) => updateDescription(item.id, e.target.value)}
                    className="w-full bg-transparent border-b border-border text-foreground text-sm py-1 focus:outline-none focus:border-primary transition-colors"
                  />
                ) : (
                  <p className="text-foreground text-sm py-1 border-b border-border">
                    {item.description || <span className="text-muted-foreground">No description</span>}
                  </p>
                )}
              </div>
            ))}

            {items.length === 0 && (
              <div className="red-box p-8 text-center col-span-full">
                <p className="text-muted-foreground tracking-wider">NO LEAKS YET</p>
                {isOwner && <p className="text-muted-foreground text-xs mt-2">Click ADD to create an entry</p>}
              </div>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="lg:w-72">
          <div className="red-box p-6 sticky top-8">
            <h2 className="rainbow-glow text-xl tracking-widest mb-4 text-center">victims</h2>
            {isOwner ? (
              <textarea
                value={victims}
                onChange={(e) => setVictims(e.target.value)}
                placeholder="Type here..."
                className="w-full h-64 bg-transparent border border-border text-foreground text-sm p-3 resize-none focus:outline-none focus:border-primary transition-colors"
              />
            ) : (
              <div className="w-full h-64 border border-border text-foreground text-sm p-3 overflow-auto whitespace-pre-wrap">
                {victims || <span className="text-muted-foreground">No data</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaksDashboard;
