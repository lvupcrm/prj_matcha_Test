import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { EditorState, EditorAction, EditorMode, ColorTheme, BlockStyle, EditableBlock, PRESET_THEMES } from '../../types';

// 초기 에디터 상태
const initialState: EditorState = {
  mode: 'view',
  selectedBlockId: null,
  blocks: [],
  colorTheme: PRESET_THEMES[0],
  isDirty: false
};

// 에디터 리듀서
const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload, selectedBlockId: action.payload === 'view' ? null : state.selectedBlockId };

    case 'SELECT_BLOCK':
      return { ...state, selectedBlockId: action.payload };

    case 'UPDATE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.map(block =>
          block.id === action.payload.id
            ? { ...block, style: { ...block.style, ...action.payload.style } }
            : block
        ),
        isDirty: true
      };

    case 'REORDER_BLOCKS':
      const reorderedBlocks = action.payload.map((id, index) => {
        const block = state.blocks.find(b => b.id === id);
        return block ? { ...block, sectionIndex: index } : null;
      }).filter(Boolean) as EditableBlock[];
      return { ...state, blocks: reorderedBlocks, isDirty: true };

    case 'UPDATE_THEME':
      return { ...state, colorTheme: action.payload, isDirty: true };

    case 'SET_DIRTY':
      return { ...state, isDirty: action.payload };

    case 'RESET_EDITOR':
      return initialState;

    default:
      return state;
  }
};

// 에디터 컨텍스트 타입
interface EditorContextType {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  // 편의 함수들
  setMode: (mode: EditorMode) => void;
  selectBlock: (id: string | null) => void;
  updateBlockStyle: (id: string, style: Partial<BlockStyle>) => void;
  reorderBlocks: (ids: string[]) => void;
  updateTheme: (theme: ColorTheme) => void;
  initializeBlocks: (sectionCount: number) => void;
  isEditMode: boolean;
}

const EditorContext = createContext<EditorContextType | null>(null);

// EditorProvider 컴포넌트
interface EditorProviderProps {
  children: ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const setMode = useCallback((mode: EditorMode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  }, []);

  const selectBlock = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_BLOCK', payload: id });
  }, []);

  const updateBlockStyle = useCallback((id: string, style: Partial<BlockStyle>) => {
    dispatch({ type: 'UPDATE_BLOCK', payload: { id, style } });
  }, []);

  const reorderBlocks = useCallback((ids: string[]) => {
    dispatch({ type: 'REORDER_BLOCKS', payload: ids });
  }, []);

  const updateTheme = useCallback((theme: ColorTheme) => {
    dispatch({ type: 'UPDATE_THEME', payload: theme });
  }, []);

  const initializeBlocks = useCallback((sectionCount: number) => {
    const blocks: EditableBlock[] = Array.from({ length: sectionCount }, (_, index) => ({
      id: `block-${index}`,
      sectionIndex: index,
      style: {
        height: 'auto',
        backgroundColor: '#ffffff',
        padding: 'medium'
      },
      isSelected: false,
      isLocked: false
    }));

    // blocks 배열을 직접 설정하는 대신, 각 블록을 업데이트
    blocks.forEach((block, index) => {
      if (!state.blocks.find(b => b.id === block.id)) {
        dispatch({ type: 'UPDATE_BLOCK', payload: { id: block.id, style: block.style } });
      }
    });
  }, [state.blocks]);

  const value: EditorContextType = {
    state,
    dispatch,
    setMode,
    selectBlock,
    updateBlockStyle,
    reorderBlocks,
    updateTheme,
    initializeBlocks,
    isEditMode: state.mode === 'edit'
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

// 에디터 컨텍스트 훅
export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

export default EditorProvider;
