import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Plus, X, Save, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ModuleItem {
  id: string;
  video_url: string | null;
  title: string;
  description: string;
  display_order: number;
  _videoFile?: File;
  _removed?: boolean;
}

const ModulesDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = (location.state as { role?: string })?.role;
  const isOwner = role === "owner";

  const [items, setItems] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("modules").select("*").order("display_order");
    if (data) setItems(data);
    setLoading(false);
    setHasChanges(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (!role || (role !== "viewer" && role !== "owner")) {
    navigate("/modules");
    return null;
  }

  const markChanged = () => setHasChanges(true);

  const addItem = () => {
    setItems([...items, {
      id: crypto.randomUUID(),
      video_url: null,
      title: "",
      description: "",
      display_order: items.length,
    }]);
    markChanged();
  };

  const removeItem = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, _removed: true } : i));
    markChanged();
  };

  const handleVideoUpload = (id: string, file: File) => {
    const url = URL.createObjectURL(file);
    setItems(items.map(i => i.id === id ? { ...i, video_url: url, _videoFile: file } : i));
    markChanged();
  };

  const updateField = (id: string, field: "title" | "description", value: string) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    markChanged();
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const removed = items.filter(i => i._removed);
      for (const item of removed) {
        await supabase.from("modules").delete().eq("id", item.id);
      }

      const active = items.filter(i => !i._removed);
      for (let idx = 0; idx < active.length; idx++) {
        const item = active[idx];
        let videoUrl = item.video_url;

        if (item._videoFile) {
          const ext = item._videoFile.name.split(".").pop();
          const path = `${item.id}.${ext}`;
          const { error: uploadErr } = await supabase.storage
            .from("module-videos")
            .upload(path, item._videoFile, { upsert: true, contentType: item._videoFile.type });
          if (!uploadErr) {
            const { data: urlData } = supabase.storage.from("module-videos").getPublicUrl(path);
            videoUrl = urlData.publicUrl;
          }
        }

        await supabase.from("modules").upsert({
          id: item.id,
          video_url: videoUrl?.startsWith("blob:") ? null : videoUrl,
          title: item.title,
          description: item.description,
          display_order: idx,
        });
      }

      toast.success("Changes saved successfully");
      await loadData();
    } catch (err) {
      toast.error("Failed to save changes");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const visibleItems = items.filter(i => !i._removed);

  if (loading) {
    return (
      <div className="scanlines flicker min-h-screen flex items-center justify-center">
        <p className="text-primary tracking-widest animate-pulse">LOADING MODULES...</p>
      </div>
    );
  }

  return (
    <div className="scanlines flicker min-h-screen p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate("/home")} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 cursor-pointer">
          <ArrowLeft size={16} /> BACK
        </button>
        <span className="text-muted-foreground text-xs tracking-wider border border-border px-3 py-1">
          {isOwner ? "OWNER ACCESS" : "VIEWER ACCESS"}
        </span>
        {isOwner && (
          <button
            onClick={saveChanges}
            disabled={!hasChanges || saving}
            className={`ml-auto flex items-center gap-2 px-4 py-2 tracking-wider text-sm transition-all cursor-pointer ${
              hasChanges
                ? "red-box text-primary hover:bg-primary/10"
                : "border border-border text-muted-foreground opacity-50 cursor-not-allowed"
            }`}
          >
            <Save size={16} /> {saving ? "SAVING..." : "SAVE CHANGES"}
          </button>
        )}
      </div>

      <h1
        className="text-primary text-3xl md:text-5xl font-bold tracking-widest mb-10 text-center"
        style={{ textShadow: "0 0 20px hsl(0 100% 50% / 0.7)" }}
      >
        REMEMBER YOUR TRUE GOD
      </h1>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-primary text-2xl tracking-widest" style={{ textShadow: "0 0 10px hsl(0 100% 50% / 0.5)" }}>
            MODULES
          </h2>
          {isOwner && (
            <button onClick={addItem} className="red-box p-2 hover:text-primary transition-colors cursor-pointer flex items-center gap-2 px-4">
              <Plus size={16} /> ADD MODULE
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleItems.map((item) => (
            <div key={item.id} className="red-box p-4 relative group">
              {isOwner && (
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                >
                  <X size={16} />
                </button>
              )}

              {item.video_url ? (
                <video
                  src={item.video_url}
                  controls
                  className="w-full h-48 object-cover mb-3 border border-border bg-black"
                />
              ) : isOwner ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border border-dashed border-border cursor-pointer hover:border-primary transition-colors mb-3 gap-2">
                  <Upload size={20} className="text-muted-foreground" />
                  <span className="text-muted-foreground text-sm tracking-wider">UPLOAD VIDEO</span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleVideoUpload(item.id, f);
                    }}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-center w-full h-48 border border-dashed border-border mb-3">
                  <span className="text-muted-foreground text-sm tracking-wider">NO VIDEO</span>
                </div>
              )}

              {isOwner ? (
                <>
                  <input
                    type="text"
                    placeholder="Title..."
                    value={item.title}
                    onChange={(e) => updateField(item.id, "title", e.target.value)}
                    className="w-full bg-transparent border-b border-border text-primary text-sm tracking-wider py-1 mb-2 focus:outline-none focus:border-primary transition-colors"
                  />
                  <textarea
                    placeholder="Description..."
                    value={item.description}
                    onChange={(e) => updateField(item.id, "description", e.target.value)}
                    className="w-full bg-transparent border border-border text-foreground text-sm p-2 resize-none h-20 focus:outline-none focus:border-primary transition-colors"
                  />
                  {isOwner && item.video_url && (
                    <label className="block mt-2 text-center text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors tracking-wider">
                      REPLACE VIDEO
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleVideoUpload(item.id, f);
                        }}
                      />
                    </label>
                  )}
                </>
              ) : (
                <>
                  <p className="text-primary text-sm tracking-wider mb-2 border-b border-border pb-1">
                    {item.title || <span className="text-muted-foreground">Untitled</span>}
                  </p>
                  <p className="text-foreground text-sm whitespace-pre-wrap">
                    {item.description || <span className="text-muted-foreground">No description</span>}
                  </p>
                </>
              )}
            </div>
          ))}

          {visibleItems.length === 0 && (
            <div className="red-box p-8 text-center col-span-full">
              <p className="text-muted-foreground tracking-wider">NO MODULES YET</p>
              {isOwner && <p className="text-muted-foreground text-xs mt-2">Click ADD MODULE to create an entry</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModulesDashboard;
