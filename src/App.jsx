import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import Sidebar from "./components/Sidebar";
import PageTabs from "./components/PageTabs";
import CanvasPage from "./components/CanvasPage";
import { PAGE_WIDTH, PAGE_HEIGHT, BALLOON_IMAGES } from "./constants";
import "./App.css";

 const STORAGE_KEY = "webtoon-conte-project";

function App() {

  const [pages, setPages] = useState(() => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    return JSON.parse(saved);
  }

  return [{ id: 1, title: "페이지 1", panels: [], balloons: [] }];
});
  const pageRefs = useRef({});
  const canvasWrapRef = useRef(null);
  const [activePageId, setActivePageId] = useState(1);
  const [zoom, setZoom] = useState(() => {
  return window.innerWidth <= 768 ? 0.45 : 1;
});
  const [scrollInfo, setScrollInfo] = useState({
    scrollTop: 0,
    width: 1,
    height: 1,
  });

  const [dialogue, setDialogue] = useState("");
  const [balloonType, setBalloonType] = useState("normal");
  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState(null);

  const activePage = pages.find((page) => page.id === activePageId);
  useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
}, [pages]);
useEffect(() => {
  if (!pages.find((page) => page.id === activePageId)) {
    setActivePageId(pages[0]?.id || 1);
  }
}, [pages, activePageId]);

  const updateScrollInfo = () => {
    const el = canvasWrapRef.current;
    if (!el) return;

    setScrollInfo({
      scrollTop: el.scrollTop,
      width: el.clientWidth,
      height: el.clientHeight,
    });
  };

  const getMousePosition = (e) => {
    const pageEl = pageRefs.current[activePageId];
    if (!pageEl) return { x: 0, y: 0 };

    const rect = pageEl.getBoundingClientRect();
    const scale = PAGE_WIDTH / rect.width;

    return {
      x: (e.clientX - rect.left) * scale,
      y: (e.clientY - rect.top) * scale,
    };
  };

  const addPage = () => {
    const newId = Date.now();

    setPages([
      ...pages,
      {
        id: newId,
        title: `페이지 ${pages.length + 1}`,
        panels: [],
        balloons: [],
      },
    ]);

    setActivePageId(newId);
    setSelected(null);
  };

  const deletePage = (pageId) => {
    if (pages.length === 1) {
      alert("페이지는 최소 1개 있어야 합니다.");
      return;
    }

    const target = pages.find((page) => page.id === pageId);
    const ok = window.confirm(`${target?.title || "이 페이지"}를 삭제할까요?`);

    if (!ok) return;

    const filtered = pages.filter((page) => page.id !== pageId);
    setPages(filtered);
    setActivePageId(pageId === activePageId ? filtered[0].id : activePageId);
    setSelected(null);
  };

  const addPanel = () => {
    const newPanel = {
      id: Date.now(),
      x: 340,
      y: 420,
      width: 560,
      height: 420,
    };

    setPages((prev) =>
      prev.map((page) =>
        page.id === activePageId
          ? { ...page, panels: [...page.panels, newPanel] }
          : page
      )
    );
  };

  const updatePanel = (pageId, panelId, changes) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId
          ? {
              ...page,
              panels: page.panels.map((panel) =>
                panel.id === panelId ? { ...panel, ...changes } : panel
              ),
            }
          : page
      )
    );
  };

  const deleteSelectedPanel = () => {
    if (!selected || selected.type !== "panel") return;

    setPages((prev) =>
      prev.map((page) =>
        page.id === selected.pageId
          ? {
              ...page,
              panels: page.panels.filter(
                (panel) => panel.id !== selected.itemId
              ),
            }
          : page
      )
    );

    setSelected(null);
  };

  const addBalloon = () => {
    if (!dialogue.trim()) return;

    const newBalloon = {
      id: Date.now(),
      text: dialogue,
      type: balloonType,
      x: 240,
      y: 260,
      width: 260,
      height: 150,
    };

    setPages((prev) =>
      prev.map((page) =>
        page.id === activePageId
          ? { ...page, balloons: [...page.balloons, newBalloon] }
          : page
      )
    );

    setDialogue("");
  };

  const updateBalloon = (pageId, balloonId, changes) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId
          ? {
              ...page,
              balloons: page.balloons.map((balloon) =>
                balloon.id === balloonId ? { ...balloon, ...changes } : balloon
              ),
            }
          : page
      )
    );
  };

  const deleteSelectedBalloon = () => {
    if (!selected || selected.type !== "balloon") return;

    setPages((prev) =>
      prev.map((page) =>
        page.id === selected.pageId
          ? {
              ...page,
              balloons: page.balloons.filter(
                (balloon) => balloon.id !== selected.itemId
              ),
            }
          : page
      )
    );

    setSelected(null);
  };

  const startPanelMove = (e, panel) => {
    e.stopPropagation();

    const mouse = getMousePosition(e);

    setSelected({
      type: "panel",
      pageId: activePageId,
      itemId: panel.id,
    });

    setAction({
      kind: "panel",
      type: "move",
      pageId: activePageId,
      itemId: panel.id,
      offsetX: mouse.x - panel.x,
      offsetY: mouse.y - panel.y,
    });
  };

  const startPanelResize = (e, panel, corner) => {
    e.stopPropagation();
    e.preventDefault();

    const mouse = getMousePosition(e);

    setSelected({
      type: "panel",
      pageId: activePageId,
      itemId: panel.id,
    });

    setAction({
      kind: "panel",
      type: "resize",
      pageId: activePageId,
      itemId: panel.id,
      corner,
      startMouseX: mouse.x,
      startMouseY: mouse.y,
      startX: panel.x,
      startY: panel.y,
      startWidth: panel.width,
      startHeight: panel.height,
    });
  };

  const startBalloonMove = (e, balloon) => {
    e.stopPropagation();

    const mouse = getMousePosition(e);

    setSelected({
      type: "balloon",
      pageId: activePageId,
      itemId: balloon.id,
    });

    setAction({
      kind: "balloon",
      type: "move",
      pageId: activePageId,
      itemId: balloon.id,
      offsetX: mouse.x - balloon.x,
      offsetY: mouse.y - balloon.y,
    });
  };

  const startBalloonResize = (e, balloon) => {
    e.stopPropagation();
    e.preventDefault();

    const mouse = getMousePosition(e);

    setAction({
      kind: "balloon",
      type: "resize",
      pageId: activePageId,
      itemId: balloon.id,
      startMouseX: mouse.x,
      startMouseY: mouse.y,
      startWidth: balloon.width,
      startHeight: balloon.height,
    });
  };

  const onMouseMove = (e) => {
    if (!action) return;

    const mouse = getMousePosition(e);

    if (action.kind === "panel") {
      if (action.type === "move") {
        updatePanel(action.pageId, action.itemId, {
          x: mouse.x - action.offsetX,
          y: mouse.y - action.offsetY,
        });
      }

      if (action.type === "resize") {
        const dx = mouse.x - action.startMouseX;
        const dy = mouse.y - action.startMouseY;

        let newX = action.startX;
        let newY = action.startY;
        let newWidth = action.startWidth;
        let newHeight = action.startHeight;

        if (action.corner.includes("right")) {
          newWidth = action.startWidth + dx;
        }

        if (action.corner.includes("left")) {
          newWidth = action.startWidth - dx;
          newX = action.startX + dx / 2;
        }

        if (action.corner.includes("bottom")) {
          newHeight = action.startHeight + dy;
        }

        if (action.corner.includes("top")) {
          newHeight = action.startHeight - dy;
          newY = action.startY + dy / 2;
        }

        updatePanel(action.pageId, action.itemId, {
          x: newX,
          y: newY,
          width: Math.max(80, newWidth),
          height: Math.max(80, newHeight),
        });
      }
    }

    if (action.kind === "balloon") {
      if (action.type === "move") {
        updateBalloon(action.pageId, action.itemId, {
          x: mouse.x - action.offsetX,
          y: mouse.y - action.offsetY,
        });
      }

      if (action.type === "resize") {
        updateBalloon(action.pageId, action.itemId, {
          width: Math.max(
            80,
            action.startWidth + (mouse.x - action.startMouseX)
          ),
          height: Math.max(
            50,
            action.startHeight + (mouse.y - action.startMouseY)
          ),
        });
      }
    }
  };

  const stopAction = () => {
    setAction(null);
  };

  const exportSinglePage = async (page) => {
    const node = pageRefs.current[page.id];
    if (!node) return;

    const oldTransform = node.style.transform;
    node.style.transform = "none";

    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 1,
      backgroundColor: "#ffffff",
    });

    node.style.transform = oldTransform;

    const link = document.createElement("a");
    link.download = `${page.title}.png`;
    link.href = dataUrl;
    link.click();
  };

  const exportAllPages = async () => {
    for (const page of pages) {
      setActivePageId(page.id);
      await new Promise((resolve) => setTimeout(resolve, 300));
      await exportSinglePage(page);
    }
  };
const saveProjectFile = () => {
  const projectData = {
    version: 1,
    savedAt: new Date().toISOString(),
    pages,
  };

  const blob = new Blob([JSON.stringify(projectData, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "webtoon-conte-project.json";
  link.click();

  URL.revokeObjectURL(url);
};

const loadProjectFile = (e) => {
 
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const projectData = JSON.parse(event.target.result);

      if (!projectData.pages) {
        alert("올바른 프로젝트 파일이 아닙니다.");
        return;
      }

      setPages(projectData.pages);
      setActivePageId(projectData.pages[0]?.id || 1);
      setSelected(null);

      alert("프로젝트를 불러왔습니다.");
    } catch (error) {
      alert("파일을 불러오는 중 오류가 발생했습니다.");
    }
  };

  reader.readAsText(file);
};
const createNewProject = () => {
  const ok = window.confirm(
    "현재 작업 내용을 모두 지우고 새 프로젝트를 만드시겠습니까?"
  );

  if (!ok) return;

  const firstPage = {
    id: Date.now(),
    title: "페이지 1",
    panels: [],
    balloons: [],
  };

  setPages([firstPage]);
  setActivePageId(firstPage.id);
  setSelected(null);
  localStorage.removeItem(STORAGE_KEY);
};
  const scrollNavigator = (e) => {
    const nav = e.currentTarget.getBoundingClientRect();
    const yRatio = (e.clientY - nav.top) / nav.height;

    const el = canvasWrapRef.current;
    if (!el) return;

    el.scrollTop = PAGE_HEIGHT * zoom * yRatio - el.clientHeight / 2;
    updateScrollInfo();
  };

  const selectedBalloon =
    selected?.type === "balloon" &&
    pages
      .find((page) => page.id === selected.pageId)
      ?.balloons.find((balloon) => balloon.id === selected.itemId);

  const selectedPanel =
    selected?.type === "panel" &&
    pages
      .find((page) => page.id === selected.pageId)
      ?.panels.find((panel) => panel.id === selected.itemId);

  const navigatorTop = (scrollInfo.scrollTop / (PAGE_HEIGHT * zoom)) * 100;
  const navigatorHeight = (scrollInfo.height / (PAGE_HEIGHT * zoom)) * 100;

  return (
    <div className="app">
      <div className="main-area">
        <PageTabs
  pages={pages}
  activePageId={activePageId}
  setActivePageId={setActivePageId}
  setSelected={setSelected}
  addPage={addPage}
  deletePage={deletePage}
/>

        <div
          className="canvas-wrap"
          ref={canvasWrapRef}
          onScroll={updateScrollInfo}
        >
          <CanvasPage
  activePage={activePage}
  pageRefs={pageRefs}
  zoom={zoom}
  selected={selected}
  setSelected={setSelected}
  onMouseMove={onMouseMove}
  stopAction={stopAction}
  startPanelMove={startPanelMove}
  startPanelResize={startPanelResize}
  startBalloonMove={startBalloonMove}
  startBalloonResize={startBalloonResize}
/>
        </div>
      </div>

              <Sidebar
        activePage={activePage}
        PAGE_WIDTH={PAGE_WIDTH}
        PAGE_HEIGHT={PAGE_HEIGHT}
        zoom={zoom}
        setZoom={setZoom}
        navigatorTop={navigatorTop}
        navigatorHeight={navigatorHeight}
        scrollNavigator={scrollNavigator}
        addPanel={addPanel}
        exportSinglePage={exportSinglePage}
        exportAllPages={exportAllPages}
        saveProjectFile={saveProjectFile}
        loadProjectFile={loadProjectFile}
        createNewProject={createNewProject}
        balloonType={balloonType}
        setBalloonType={setBalloonType}
        dialogue={dialogue}
        setDialogue={setDialogue}
        addBalloon={addBalloon}
        selectedBalloon={selectedBalloon}
        selectedPanel={selectedPanel}
        selected={selected}
        updateBalloon={updateBalloon}
        deleteSelectedBalloon={deleteSelectedBalloon}
        deleteSelectedPanel={deleteSelectedPanel}
      />
    </div>
  );
}

export default App;