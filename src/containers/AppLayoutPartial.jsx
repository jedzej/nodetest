import React from 'react';

export default (props) => (
  <div className="appLayoutPartial" style={{ width: '100%', height: '100%', margin: 0 }}>
    {props.children}
  </div>
);