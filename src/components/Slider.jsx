import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Slider.scss';

const Slider = ({
  min = 0,
  max = 20,
  step = 1,
  initialValue = 0,
  type = 'continuous',
  subtype = 'single',
  handleSize = 'Size_32',
  onChange,
}) => {
  const [value, setValue] = useState(initialValue);
  const [rangeValue, setRangeValue] = useState([min, max]);
  const [dragging, setDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const sliderTrack = sliderRef.current.querySelector('.slider-track');
    if (sliderTrack) {
      if (subtype === 'range') {
        const percentageStart = ((rangeValue[0] - min) / (max - min)) * 100;
        const percentageEnd = ((rangeValue[1] - min) / (max - min)) * 100;
        sliderTrack.style.background = `linear-gradient(to right, 
          #ddd ${percentageStart}%, 
          #4CAF50 ${percentageStart}%, 
          #4CAF50 ${percentageEnd}%, 
          #ddd ${percentageEnd}%)`;
      } else {
        const percentage = ((value - min) / (max - min)) * 100;
        sliderTrack.style.background = `linear-gradient(to right, 
          #4CAF50 ${percentage}%, 
          #ddd ${percentage}%)`;
      }
    }
  }, [rangeValue, value, min, max, subtype]);

  const handlePosition = (val) => {
    return ((val - min) / (max - min)) * 100;
  };

  const handleMouseDown = (event, handle) => {
    event.preventDefault();
    setDragging(true);
    setDragHandle(handle);
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      const sliderRect = sliderRef.current.getBoundingClientRect();
      const sliderWidth = sliderRect.width;
      const offsetX = event.clientX - sliderRect.left;
      const percentage = Math.min(Math.max(0, (offsetX / sliderWidth) * 100), 100);
      const newValue = min + ((percentage / 100) * (max - min));

      if (type === 'discreet') {
        const stepValue = Math.round(newValue / step) * step;
        if (subtype === 'single') {
          setValue(stepValue);
          if (onChange) onChange(stepValue);
        } else if (subtype === 'range') {
          if (dragHandle === 'lower') {
            if (stepValue <= rangeValue[1]) {
              setRangeValue([stepValue, rangeValue[1]]);
              if (onChange) onChange([stepValue, rangeValue[1]]);
            }
          } else if (dragHandle === 'upper') {
            if (stepValue >= rangeValue[0]) {
              setRangeValue([rangeValue[0], stepValue]);
              if (onChange) onChange([rangeValue[0], stepValue]);
            }
          }
        }
      } else { // Continuous
        if (subtype === 'single') {
          setValue(newValue);
          if (onChange) onChange(newValue);
        } else if (subtype === 'range') {
          if (dragHandle === 'lower') {
            if (newValue <= rangeValue[1]) {
              setRangeValue([newValue, rangeValue[1]]);
              if (onChange) onChange([newValue, rangeValue[1]]);
            }
          } else if (dragHandle === 'upper') {
            if (newValue >= rangeValue[0]) {
              setRangeValue([rangeValue[0], newValue]);
              if (onChange) onChange([rangeValue[0], newValue]);
            }
          }
        }
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragHandle(null);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, rangeValue, value, dragHandle]);

  return (
    <div className="slider-container" ref={sliderRef}>
      <div className="slider-wrapper">
        {subtype === 'range' ? (
          <>
            <input
              type="range"
              value={rangeValue[0]}
              min={min}
              max={max}
              step={step}
              className={`slider ${handleSize} lower`}
              readOnly
            />
            <input
              type="range"
              value={rangeValue[1]}
              min={min}
              max={max}
              step={step}
              className={`slider ${handleSize} upper`}
              readOnly
            />
            <div className="slider-track" />
            <div
              className="slider-handle lower-handle"
              style={{ left: `calc(${handlePosition(rangeValue[0])}% - ${handleSize === 'Size_24' ? 12 : 16}px)` }}
              onMouseDown={(e) => handleMouseDown(e, 'lower')}
            >
              <div className="handle-inner-dot"></div>
            </div>
            <div
              className="slider-handle upper-handle"
              style={{ left: `calc(${handlePosition(rangeValue[1])}% - ${handleSize === 'Size_24' ? 12 : 16}px)` }}
              onMouseDown={(e) => handleMouseDown(e, 'upper')}
            >
              <div className="handle-inner-dot"></div>
            </div>
          </>
        ) : (
          <>
            <input
              type="range"
              value={value}
              min={min}
              max={max}
              step={step}
              className={`slider ${handleSize}`}
              onChange={(e) => setValue(Number(e.target.value))}
              readOnly
            />
            <div className="slider-track" />
            <div
              className="slider-handle"
              style={{ left: `calc(${handlePosition(value)}% - ${handleSize === 'Size_24' ? 12 : 16}px)` }}
              onMouseDown={(e) => handleMouseDown(e, 'single')}
            >
              <div className="handle-inner-dot"></div>
            </div>
          </>
        )}
      </div>
      <div className="tooltips">
        {subtype === 'range' ? (
          <>
            <div className="tooltip lower-tooltip" style={{ left: `calc(${handlePosition(rangeValue[0])}% - 25px)` }}>
              {rangeValue[0]}
            </div>
            <div className="tooltip upper-tooltip" style={{ left: `calc(${handlePosition(rangeValue[1])}% - 25px)` }}>
              {rangeValue[1]}
            </div>
          </>
        ) : (
          <div className="tooltip" style={{ left: `calc(${handlePosition(value)}% - 25px)` }}>
            {value}
          </div>
        )}
      </div>
    </div>
  );
};

Slider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  initialValue: PropTypes.number,
  type: PropTypes.oneOf(['continuous', 'discreet']),
  subtype: PropTypes.oneOf(['single', 'range']),
  handleSize: PropTypes.oneOf(['Size_24', 'Size_32']),
  onChange: PropTypes.func,
};

export default Slider;
