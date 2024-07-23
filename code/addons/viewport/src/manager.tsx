import * as React from 'react';
import { addons, types } from 'storybook/internal/manager-api';

import { ADDON_ID } from './constants';

import { ViewportTool as LegacyViewportTool } from './legacy/ToolLegacy';
import { ViewportTool as ModernViewportTool } from './Tool';

addons.register(ADDON_ID, (api) => {
  addons.add(ADDON_ID, {
    title: 'viewport / media-queries',
    type: types.TOOL,
    match: ({ viewMode, tabId }) => viewMode === 'story' && !tabId,
    render: () =>
      FEATURES?.viewportStoryGlobals ? <ModernViewportTool api={api} /> : <LegacyViewportTool />,
  });
});
