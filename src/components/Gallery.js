import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Gallery({ folder = "/gallery/myArt", maxImages = 50, ext = "jpg" }) {
    const [images, setImages] = useState([]);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let mounted = true;
        async function load() {
            const base = folder.replace(/\/$/, "");
            // try manifest first
            try {
                const m = await fetch(`${base}/images.json`);
                if (m.ok) {
                    const list = await m.json(); // expect array of filenames e.g. ["1.jpg","2.jpg"]
                    const urls = list.map((f) => `${base}/${f}`);
                    if (mounted) setImages(urls);
                    return;
                }
            } catch {
                // ignore and fallback
            }

            // fallback: probe sequential names (1.jpg, 2.jpg, ...)
            const found = [];
            for (let i = 1; i <= maxImages; i++) {
                const url = `${base}/${i}.${ext}`;
                try {
                    const res = await fetch(url, { method: "HEAD" });
                    if (res.ok) found.push(url);
                    else break;
                } catch {
                    break;
                }
            }
            if (mounted) setImages(found);
        }
        load();
        return () => {
            mounted = false;
        };
    }, [folder, maxImages, ext]);

    useEffect(() => {
        if (!images.length) return;
        const params = new URLSearchParams(location.search);
        const file = params.get("file");
        if (file) {
            const i = images.findIndex((u) => u.endsWith("/" + file) || u.endsWith(file));
            if (i >= 0) setIndex(i);
        }
    }, [images, location.search]);

    useEffect(() => {
        if (!images.length) return;
        const filename = images[index]?.split("/").pop() || "";
        const params = new URLSearchParams(location.search);
        if (filename) params.set("file", filename);
        else params.delete("file");
        navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }, [index, images, navigate, location.pathname, location.search]);

    if (!images.length) {
        return <div className="ProjectPreview">No images found in {folder}</div>;
    }

    return (
        <div className="Gallery">
            <div>
                <button onClick={() => setIndex((index - 1 + images.length) % images.length)}>Back</button>
                <button onClick={() => setIndex((index + 1) % images.length)}>Next</button>
            </div>
            <img src={images[index]} alt={`Gallery ${index + 1}`} style={{ maxWidth: "50%" }} />
        </div>
    );
}

export default Gallery;