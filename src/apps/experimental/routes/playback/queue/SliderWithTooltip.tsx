import React, { FunctionComponent } from 'react';

import Tooltip from '@mui/material/Tooltip';
import Slider from '@mui/material/Slider';

// import globalize from 'scripts/globalize';

interface SliderWithTooltipProps {
    onChange: (event: Event, value: number | number[], activeThumb: number) => void;
    value: any;
}

export function SliderWithTooltip ({ onChange, value }: SliderWithTooltipProps) {
    return (
        <Tooltip title="You don't have permission to do this" followCursor>
            <Slider aria-label='Volume' value={value} onChange={onChange} />
        </Tooltip>
    );
}
