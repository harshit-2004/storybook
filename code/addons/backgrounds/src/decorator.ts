import { useEffect } from 'storybook/internal/preview-api';
import type {
  Renderer,
  PartialStoryFn as StoryFunction,
  StoryContext,
} from 'storybook/internal/types';

import { PARAM_KEY as KEY } from './constants';
import { clearStyles, addBackgroundStyle, isReduceMotionEnabled, addGridStyle } from './utils';
import type { Config, GridConfig } from './types';

const defaultGrid: GridConfig = {
  cellSize: 100,
  cellAmount: 10,
  opacity: 0.8,
};

const BG_SELECTOR_BASE = `addon-backgrounds`;
const GRID_SELECTOR_BASE = 'addon-backgrounds-grid';

const transitionStyle = isReduceMotionEnabled() ? '' : 'transition: background-color 0.3s;';

export const withBackgroundAndGrid = (
  StoryFn: StoryFunction<Renderer>,
  context: StoryContext<Renderer>
) => {
  const { globals, parameters, viewMode, id } = context;
  const { options = {}, disabled, grid = defaultGrid } = (parameters[KEY] || {}) as Config;
  const data = globals[KEY] || {};
  const backgroundName: string = data.value;

  const item = options[backgroundName];
  const value = item?.value || 'transparent';

  const showGrid = data.grid || false;
  const shownBackground = !!item && !disabled;

  const backgroundSelector = viewMode === 'docs' ? `#anchor--${id} .docs-story` : '.sb-show-main';
  const gridSelector = viewMode === 'docs' ? `#anchor--${id} .docs-story` : '.sb-show-main';

  const isLayoutPadded = parameters.layout === undefined || parameters.layout === 'padded';
  const defaultOffset = viewMode === 'docs' ? 20 : isLayoutPadded ? 16 : 0;
  const { cellAmount, cellSize, opacity, offsetX = defaultOffset, offsetY = defaultOffset } = grid;

  const backgroundSelectorId =
    viewMode === 'docs' ? `${BG_SELECTOR_BASE}-docs-${id}` : `${BG_SELECTOR_BASE}-color`;
  const backgroundTarget = viewMode === 'docs' ? id : null;

  useEffect(() => {
    const backgroundStyles = `
    ${backgroundSelector} {
      background: ${value} !important;
      ${transitionStyle}
      }`;

    if (!shownBackground) {
      clearStyles(backgroundSelectorId);
      return;
    }

    addBackgroundStyle(backgroundSelectorId, backgroundStyles, backgroundTarget);
  }, [backgroundSelector, backgroundSelectorId, backgroundTarget, shownBackground, value]);

  const gridSelectorId =
    viewMode === 'docs' ? `${GRID_SELECTOR_BASE}-docs-${id}` : `${GRID_SELECTOR_BASE}`;
  useEffect(() => {
    if (!showGrid) {
      clearStyles(gridSelectorId);
      return;
    }
    const gridSize = [
      `${cellSize * cellAmount}px ${cellSize * cellAmount}px`,
      `${cellSize * cellAmount}px ${cellSize * cellAmount}px`,
      `${cellSize}px ${cellSize}px`,
      `${cellSize}px ${cellSize}px`,
    ].join(', ');

    const gridStyles = `
        ${gridSelector} {
          background-size: ${gridSize} !important;
          background-position: ${offsetX}px ${offsetY}px, ${offsetX}px ${offsetY}px, ${offsetX}px ${offsetY}px, ${offsetX}px ${offsetY}px !important;
          background-blend-mode: difference !important;
          background-image: linear-gradient(rgba(130, 130, 130, ${opacity}) 1px, transparent 1px),
           linear-gradient(90deg, rgba(130, 130, 130, ${opacity}) 1px, transparent 1px),
           linear-gradient(rgba(130, 130, 130, ${opacity / 2}) 1px, transparent 1px),
           linear-gradient(90deg, rgba(130, 130, 130, ${
             opacity / 2
           }) 1px, transparent 1px) !important;
        }
      `;

    addGridStyle(gridSelectorId, gridStyles);
  }, [cellAmount, cellSize, gridSelector, gridSelectorId, showGrid, offsetX, offsetY, opacity]);

  return StoryFn();
};
