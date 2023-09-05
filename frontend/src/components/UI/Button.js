import React from 'react';

export default function Button(props) {
  return (
    <div className="bg-yellow-400 py-1 px-3 rounded-md border outline-white w-fit m-auto font-semibold cursor-pointer">
      {props.children}
    </div>
  );
}
