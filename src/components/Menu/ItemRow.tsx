// import React from 'react';

// interface ItemRowProps {
//   name: string;
//   category?: string;
//   isAvailable: boolean;
// }

// export const ItemRow: React.FC<ItemRowProps> = ({ name, isAvailable }) => {
//   return (
//     <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
//       <div className="flex flex-col text-left">
//         <span className="font-semibold text-gray-800">{name}</span>
//         {!isAvailable && (
//           <span className="text-xs text-red-500 font-medium italic">Off menu indefinitely</span>
//         )}
//       </div>
//       <div className="flex items-center gap-3">
//         <button className="text-gray-400 hover:text-gray-600">
//           <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
//             <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };
