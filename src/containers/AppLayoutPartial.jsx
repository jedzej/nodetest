import React from 'react';

export default (props) => (
  <div className="appLayoutPartial" style={{ width: '100%', height: '100%' }}>
    {props.children}
  </div>
);