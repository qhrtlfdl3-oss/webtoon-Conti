import Navigator from "./Navigator";

function Sidebar({
  activePage,
  PAGE_WIDTH,
  PAGE_HEIGHT,
  zoom,
  setZoom,
  navigatorTop,
  navigatorHeight,
  scrollNavigator,

  addPanel,
  exportSinglePage,
  exportAllPages,
  saveProjectFile,
  loadProjectFile,
  createNewProject,

  balloonType,
  setBalloonType,
  dialogue,
  setDialogue,
  addBalloon,
  importTextFile,

  selectedBalloon,
  selectedPanel,
  selected,
  updateBalloon,
  deleteSelectedBalloon,
  deleteSelectedPanel,
}) {
  return (
    <div className="sidebar">
      <div className="toolbar-row">
        <button className="tool-icon" title="웹툰 칸 추가" onClick={addPanel}>
          📐
        </button>

        <button
          className="tool-icon"
          title="현재 페이지 PNG"
          onClick={() => activePage && exportSinglePage(activePage)}
        >
          🖼️
        </button>

        <button
          className="tool-icon"
          title="전체 PNG 내보내기"
          onClick={exportAllPages}
        >
          📚
        </button>

        <button
          className="tool-icon"
          title="새 프로젝트"
          onClick={createNewProject}
        >
          ＋
        </button>

        <button
          className="tool-icon"
          title="프로젝트 저장"
          onClick={saveProjectFile}
        >
          💾
        </button>

        <label className="tool-icon file-icon" title="프로젝트 불러오기">
          📂
          <input type="file" accept=".json" onChange={loadProjectFile} hidden />
        </label>

        <label className="tool-icon file-icon" title="TXT 대사 불러오기">
          📝
          <input type="file" accept=".txt" onChange={importTextFile} hidden />
        </label>
      </div>

      <Navigator
        activePage={activePage}
        PAGE_WIDTH={PAGE_WIDTH}
        PAGE_HEIGHT={PAGE_HEIGHT}
        zoom={zoom}
        setZoom={setZoom}
        navigatorTop={navigatorTop}
        navigatorHeight={navigatorHeight}
        scrollNavigator={scrollNavigator}
      />

      <hr />

      {selectedBalloon && (
        <>
          <h3>선택 항목 편집</h3>

          <label>대사 수정</label>
          <textarea
            value={selectedBalloon.text}
            onChange={(e) =>
              updateBalloon(selected.pageId, selected.itemId, {
                text: e.target.value,
              })
            }
          />
<label className="checkbox-row">
  <input
    type="checkbox"
    checked={selectedBalloon.maskOverlap || false}
    onChange={(e) =>
      updateBalloon(selected.pageId, selected.itemId, {
        maskOverlap: e.target.checked,
      })
    }
  />
  겹친 선 지우기
</label>

{selectedBalloon.maskOverlap && (
  <>
    <label>마스크 크기</label>
    <input
      type="range"
      min="20"
      max="150"
      value={selectedBalloon.maskSize || 70}
      onChange={(e) =>
        updateBalloon(selected.pageId, selected.itemId, {
          maskSize: Number(e.target.value),
        })
      }
    />

    <div className="slider-value">
      {selectedBalloon.maskSize || 70}px
    </div>
  </>
)}
          <label>말풍선 종류</label>
          <select
            value={selectedBalloon.type}
            onChange={(e) =>
              updateBalloon(selected.pageId, selected.itemId, {
                type: e.target.value,
              })
            }
          >
            <option value="normal">일반 말풍선</option>
            <option value="thought">성게 풍선</option>
            <option value="shout">외침 말풍선</option>
            <option value="narration">내레이션 박스</option>
            <option value="text">텍스트만</option>
          </select>

          <button className="delete-button" onClick={deleteSelectedBalloon}>
            말풍선 삭제
          </button>

          <hr />
        </>
      )}

      {selectedPanel && (
        <>
          <h3>선택 항목 편집</h3>

          <p className="tip">
            웹툰 칸이 선택되었습니다. 드래그로 이동, 네 모서리 핸들로 크기
            조절 가능합니다.
          </p>

          <button className="delete-button" onClick={deleteSelectedPanel}>
            웹툰 칸 삭제
          </button>

          <hr />
        </>
      )}

      <h3>새 말풍선 만들기</h3>

      <label>말풍선 종류</label>
      <select
        value={balloonType}
        onChange={(e) => setBalloonType(e.target.value)}
      >
        <option value="normal">일반 말풍선</option>
        <option value="thought">성게 풍선</option>
        <option value="shout">외침 말풍선</option>
        <option value="narration">내레이션 박스</option>
        <option value="text">텍스트만</option>
      </select>

      <textarea
        value={dialogue}
        onChange={(e) => setDialogue(e.target.value)}
        placeholder="대사를 입력하세요"
      />

      <button onClick={addBalloon}>말풍선 생성</button>
    </div>
  );
}

export default Sidebar;