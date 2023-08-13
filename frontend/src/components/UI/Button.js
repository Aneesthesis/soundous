import React from 'react';

export default function Button(props) {
  return (
    <div className="bg-black py-1 px-3 text-white border outline-white w-fit m-auto cursor-pointer">
      {props.children}
    </div>
  );
}
