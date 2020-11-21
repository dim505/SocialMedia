import React from 'react';
import './ToolbarButton.scss';


//Obsolete code 
export default function ToolbarButton(props) {
    const { icon } = props;
    return (
      <i className={`toolbar-button ${icon}`} />
    );
}