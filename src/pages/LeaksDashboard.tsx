import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Plus, X, Save, ExternalLink, Paperclip, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LeakItem {
  id: string;
  image_url: string | null;
  description: string;
  display_order: number;
  _imageFile?: File;
  _removed?: boolean;
}

interface SidebarItem {
  id: string;
  text: string;
  attachment_url: string | null;
  attachment_name: string | null;
  notes: string | null;
  display_order: number;
  _removed?: boolean;
  _isNew?: boolean;
}

const LeaksDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = (location.state as { role?: string })?.role;
  const isOwner = role === "owner";

  const [items, setItems] = useState<LeakItem[]>([]);
  const [victims, setVictims] = useState("");
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSidebar, setExpandedSidebar] = useState<string | null>(null);

  // Original state for change detection
  const [origVictims, setOrigVictims] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const [leaksRes, victimsRes, sidebarRes] = await Promise.all([
      supabase.from("leaks").select("*").order("display_order"),
      supabase.from("victim_notes").select("*").limit(1),
      supabase.from("sidebar_items").select("*").order("display_order"),
    ]);

    if (leaksRes.data) setItems(leaksRes.data.map(l => ({ ...l, image_url: l.image_url })));
    if (victimsRes.data?.[0]) {
      setVictims(victimsRes.data[0].content);
      setOrigVictims(victimsRes.data[0].content);
    }
    if (sidebarRes.data) setSidebarItems(sidebarRes.data);
    setLoading(false);
    setHasChanges(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (!role || (role !== "viewer" && role !== "owner")) {
    navigate("/leaks");
    return null;
  }

  const markChanged = () => setHasChanges(true);

  const addItem = () => {
    const newItem: LeakItem = {
      id: crypto.randomUUID(),
      image_url: null,
      description: "",
      display_order: items.length,
    };
    setItems([...items, newItem]);
    markChanged();
  };

  const removeItem = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, _removed: true } : i));
    markChanged();
  };

  const handleImageUpload = (id: string, file: File) => {
    const url = URL.createObjectURL(file);
    setItems(items.map(i => i.id === id ? { ...i, image_url: url, _imageFile: file } : i));
    markChanged();
  };

  const updateDescription = (id: string, desc: string) => {
    setItems(items.map(i => i.id === id ? { ...i, description: desc } : i));
    markChanged();
  };

  const updateVictims = (val: string) => {
    setVictims(val);
    markChanged();
  };

  // Sidebar actions
  const addSidebarItem = () => {
    const newItem: SidebarItem = {
      id: crypto.randomUUID(),
      text: "",
      attachment_url: null,
      attachment_name: null,
      notes: null,
      display_order: sidebarItems.length,
      _isNew: true,
    };
    setSidebarItems([...sidebarItems, newItem]);
    markChanged();
  };

  const removeSidebarItem = (id: string) => {
    setSidebarItems(sidebarItems.map(i => i.id === id ? { ...i, _removed: true } : i));
    markChanged();
  };

  const updateSidebarItem = (id: string, field: keyof SidebarItem, value: string) => {
    setSidebarItems(sidebarItems.map(i => i.id === id ? { ...i, [field]: value } : i));
    markChanged();
  };

  const handleAttachmentUpload = (id: string, file: File) => {
    const url = URL.createObjectURL(file);
    setSidebarItems(sidebarItems.map(i => i.id === id ? { ...i, attachment_url: url, attachment_name: file.name, _attachFile: file } as any : i));
    markChanged();
  };

  // Save all changes
  const saveChanges = async () => {
    setSaving(true);
    try {
      // 1. Handle removed leaks
      const removedLeaks = items.filter(i => i._removed);
      for (const item of removedLeaks) {
        await supabase.from("leaks").delete().eq("id", item.id);
      }

      // 2. Upload images and upsert leaks
      const activeLeaks = items.filter(i => !i._removed);
      for (let idx = 0; idx < activeLeaks.length; idx++) {
        const item = activeLeaks[idx];
        let imageUrl = item.image_url;

        // Upload new image if needed
        if (item._imageFile) {
          const ext = item._imageFile.name.split(".").pop();
          const path = `${item.id}.${ext}`;
          const { error: uploadErr } = await supabase.storage
            .from("leak-images")
            .upload(path, item._imageFile, { upsert: true });
          if (!uploadErr) {
            const { data: urlData } = supabase.storage.from("leak-images").getPublicUrl(path);
            imageUrl = urlData.publicUrl;
          }
        }

        await supabase.from("leaks").upsert({
          id: item.id,
          image_url: imageUrl?.startsWith("blob:") ? null : imageUrl,
          description: item.description,
          display_order: idx,
        });
      }

      // 3. Save victim notes
      const { data: existingNotes } = await supabase.from("victim_notes").select("id").limit(1);
      if (existingNotes?.[0]) {
        await supabase.from("victim_notes").update({ content: victims }).eq("id", existingNotes[0].id);
      }

      // 4. Handle sidebar items
      const removedSidebar = sidebarItems.filter(i => i._removed);
      for (const item of removedSidebar) {
        if (!item._isNew) await supabase.from("sidebar_items").delete().eq("id", item.id);
      }

      const activeSidebar = sidebarItems.filter(i => !i._removed);
      for (let idx = 0; idx < activeSidebar.length; idx++) {
        const item = activeSidebar[idx];
        let attachUrl = item.attachment_url;
        const attachFile = (item as any)._attachFile as File | undefined;

        if (attachFile) {
          const path = `attachments/${item.id}-${attachFile.name}`;
          const { error: uploadErr } = await supabase.storage
            .from("leak-images")
            .upload(path, attachFile, { upsert: true });
          if (!uploadErr) {
            const { data: urlData } = supabase.storage.from("leak-images").getPublicUrl(path);
            attachUrl = urlData.publicUrl;
          }
        }

        await supabase.from("sidebar_items").upsert({
          id: item.id,
          text: item.text,
          attachment_url: attachUrl?.startsWith("blob:") ? null : attachUrl,
          attachment_name: item.attachment_name,
          notes: item.notes,
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
  const visibleSidebar = sidebarItems.filter(i => !i._removed);

  if (loading) {
    return (
      <div className="scanlines flicker min-h-screen flex items-center justify-center">
        <p className="text-primary tracking-widest animate-pulse">LOADING DATA...</p>
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

      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
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

                {item.image_url ? (
                  <img src={item.image_url} alt="" className="w-full h-48 object-cover mb-3 border border-border" />
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

            {visibleItems.length === 0 && (
              <div className="red-box p-8 text-center col-span-full">
                <p className="text-muted-foreground tracking-wider">NO LEAKS YET</p>
                {isOwner && <p className="text-muted-foreground text-xs mt-2">Click ADD to create an entry</p>}
              </div>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="lg:w-80">
          {/* Victims panel */}
          <div className="red-box p-6 mb-4 sticky top-8">
            <h2 className="rainbow-glow text-xl tracking-widest mb-4 text-center">victims</h2>
            {isOwner ? (
              <textarea
                value={victims}
                onChange={(e) => updateVictims(e.target.value)}
                placeholder="Type here..."
                className="w-full h-40 bg-transparent border border-border text-foreground text-sm p-3 resize-none focus:outline-none focus:border-primary transition-colors"
              />
            ) : (
              <div className="w-full h-40 border border-border text-foreground text-sm p-3 overflow-auto whitespace-pre-wrap">
                {victims || <span className="text-muted-foreground">No data</span>}
              </div>
            )}
          </div>

          {/* Dynamic list panel */}
          <div className="red-box p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-primary text-lg tracking-widest" style={{ textShadow: "0 0 8px hsl(0 100% 50% / 0.4)" }}>
                LIST
              </h2>
              {isOwner && (
                <button onClick={addSidebarItem} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  <Plus size={16} />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {visibleSidebar.map((item) => (
                <div key={item.id} className="border border-border p-3 group relative">
                  {isOwner && (
                    <button
                      onClick={() => removeSidebarItem(item.id)}
                      className="absolute top-1 right-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  )}

                  {isOwner ? (
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => updateSidebarItem(item.id, "text", e.target.value)}
                      placeholder="Item text..."
                      className="w-full bg-transparent text-foreground text-sm focus:outline-none border-b border-transparent focus:border-primary transition-colors mb-1"
                    />
                  ) : (
                    <p className="text-foreground text-sm mb-1">{item.text || <span className="text-muted-foreground">—</span>}</p>
                  )}

                  {/* Attachment */}
                  {item.attachment_url ? (
                    <a
                      href={item.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary text-xs hover:underline mb-1"
                    >
                      <Paperclip size={10} /> {item.attachment_name || "Attachment"} <ExternalLink size={10} />
                    </a>
                  ) : isOwner ? (
                    <label className="flex items-center gap-1 text-muted-foreground text-xs cursor-pointer hover:text-primary transition-colors mb-1">
                      <Paperclip size={10} /> Attach file
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleAttachmentUpload(item.id, f);
                        }}
                      />
                    </label>
                  ) : null}

                  {/* Notes toggle */}
                  <button
                    onClick={() => setExpandedSidebar(expandedSidebar === item.id ? null : item.id)}
                    className="flex items-center gap-1 text-muted-foreground text-xs hover:text-primary transition-colors cursor-pointer"
                  >
                    {expandedSidebar === item.id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    Notes
                  </button>

                  {expandedSidebar === item.id && (
                    <div className="mt-2">
                      {isOwner ? (
                        <textarea
                          value={item.notes || ""}
                          onChange={(e) => updateSidebarItem(item.id, "notes", e.target.value)}
                          placeholder="Add notes..."
                          className="w-full bg-transparent border border-border text-foreground text-xs p-2 resize-none h-20 focus:outline-none focus:border-primary transition-colors"
                        />
                      ) : (
                        <p className="text-foreground text-xs p-2 border border-border">
                          {item.notes || <span className="text-muted-foreground">No notes</span>}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {visibleSidebar.length === 0 && (
                <p className="text-muted-foreground text-xs text-center tracking-wider">NO ITEMS</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaksDashboard;
