import React, { useEffect, useState } from 'react';
import { Box, Slider, TextField, InputAdornment, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledTextField = styled(TextField)({
    width: '130px',
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#d1d5db', // Màu viền bình thường
        },
        '&:hover fieldset': {
            borderColor: '#d1d5db', // Màu viền khi hover
        },
        '&.Mui-focused fieldset': {
            borderColor: '#9ca3af', // Màu viền khi focus
        },
    },
    '& .MuiInputBase-input': {
        paddingRight: '10px',
        fontSize: '14px',
        '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0,
        },
        '&[type=number]': {
            '-moz-appearance': 'textfield',
        },
    },
    '& .MuiInputLabel-root': {
        color: '#9ca3af', // Màu nhãn bình thường
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#9ca3af', // Màu nhãn khi focus
    },
});

const RangeSlider = (props) => {
    const [range, setRange] = useState([0, 500000]);
    const [minValue, setMinValue] = useState('');
    const [maxValue, setMaxValue] = useState('');
    const [minFocused, setMinFocused] = useState(false);
    const [maxFocused, setMaxFocused] = useState(false);
    const [minVndVisible, setMinVndVisible] = useState(false); // Trạng thái hiển thị vnd cho ô Min
    const [maxVndVisible, setMaxVndVisible] = useState(false); // Trạng thái hiển thị vnd cho ô Max

    const formatNumber = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handleSliderChange = (event, newValue) => {
        setRange(newValue);
        setMinValue(newValue[0]);
        setMaxValue(newValue[1]);
    };

    const handleMinInputChange = (event) => {
        const value = event.target.value === '' ? '' : Math.min(Number(event.target.value.replace(/\./g, '')), 500000);
        setMinValue(value);
        setRange([value, range[1]]);
    };

    const handleMaxInputChange = (event) => {
        const value = event.target.value === '' ? '' : Math.min(Number(event.target.value.replace(/\./g, '')), 500000);
        setMaxValue(value);
        setRange([range[0], value]);
    };

    const marks = [
        {
            value: 0,
            label: '0',
        },
        {
            value: 500000,
            label: '500.000',
        },
    ];

    useEffect(() => {
        props.priceRange(minValue, maxValue);
    }, [minValue, maxValue]);

    return (
        <Box sx={{ width: 300, padding: 2 }}>
            <Slider
                value={range}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                max={500000}
                step={20000}
                marks={marks}
                valueLabelFormat={(value) => {
                    if (value === 0) {
                        return '0';
                    } else if (value === 500000) {
                        return '5 trăm';
                    } else {
                        return value;
                    }
                }}
                sx={{ color: '#2B5A50' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginLeft: '-15px' }}>
                <Box sx={{ marginInline: '10px' }}>
                    <StyledTextField
                        label={<Typography variant="body1" style={{ fontSize: '13px' }}>MIN</Typography>}
                        type="text"
                        value={minValue ? formatNumber(minValue) : ''}
                        onChange={handleMinInputChange}
                        onFocus={() => {
                            setMinFocused(true);
                            setMinVndVisible(true); // Hiển thị vnd khi ô Min được focus
                        }}
                        onBlur={() => {
                            setMinFocused(false);
                            if (minValue === '') setMinVndVisible(false); // Ẩn vnd khi mất focus khỏi ô Min và ô không có giá trị
                        }}
                        InputProps={{
                            inputProps: { min: 0, max: 500000 },
                            endAdornment: (minFocused && minVndVisible) && (
                            <InputAdornment position="end">
                                <Typography sx={{ fontSize: '10px' }}>VND</Typography>
                                </InputAdornment>
                            ), // Chỉ hiển thị khi ô được focus và có giá trị
                        }}
                    />
                </Box>
                <Box sx={{
                    marginInline: '5px',
                    width: '10px',
                    height: '20%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    lineHeight: '20%',
                    margin: 'auto',
                }}>
                    <Typography variant="body1">-</Typography>
                </Box>
                <Box sx={{ marginInline: '10px' }}>
                    <StyledTextField
                        label={<Typography variant="body1" style={{ fontSize: '13px' }}>MAX</Typography>}
                        type="text"
                        value={maxValue ? formatNumber(maxValue) : ''}
                        onChange={handleMaxInputChange}
                        onFocus={() => {
                            setMaxFocused(true);
                            setMaxVndVisible(true); // Hiển thị vnd khi ô Max được focus
                        }}
                        onBlur={() => {
                            setMaxFocused(false);
                            if (maxValue === '') setMaxVndVisible(false); // Ẩn vnd khi mất focus khỏi ô Max và ô không có giá trị
                        }}
                        InputProps={{
                            inputProps: { min: 0, max: 500000 },
                            endAdornment: (maxFocused && maxVndVisible) && (
                            <InputAdornment position="end">
                                <Typography sx={{ fontSize: '10px' }}>VND</Typography>
                                </InputAdornment>
                            ), // Chỉ hiển thị khi ô được focus và có giá trị
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default RangeSlider;
