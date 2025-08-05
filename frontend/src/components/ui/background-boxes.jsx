"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);
  let colors = [
    "#93c5fd",
    "#f9a8d4",
    "#86efac",
    "#fde047",
    "#fca5a5",
    "#d8b4fe",
    "#93c5fd",
    "#a5b4fc",
    "#c4b5fd",
  ];
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-60%,-60%) skewX(-48deg) scale(1.5) skewY(14deg) rotate(0deg)`,
      }}
      className={cn(
        "absolute left-1/2 top-1/2 z-0 flex w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none",
        className
      )}
      {...rest}
    >
      {/* Background Boxes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          style={{
            transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) rotate(0deg)`,
          }}
          className="absolute left-1/2 top-1/2 flex w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2"
        >
          {rows.map((_, i) => (
            <motion.div
              key={`row` + i}
              className="relative h-8 w-16 border-l border-slate-700"
            >
              {cols.map((_, j) => (
                <motion.div
                  whileHover={{
                    backgroundColor: `${getRandomColor()}`,
                    transition: { duration: 0 },
                  }}
                  animate={{
                    transition: { duration: 2 },
                  }}
                  key={`col` + j}
                  className="relative h-8 w-16 border-t border-r border-slate-700"
                >
                  {j % 2 === 0 && i % 2 === 0 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-slate-700"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v12m6-6H6"
                      />
                    </svg>
                  ) : null}
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Konten utama */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold">Halo Dunia</h1>
      </div>
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
