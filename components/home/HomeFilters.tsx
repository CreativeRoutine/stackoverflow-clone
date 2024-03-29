"use client";

import { HomePageFilters } from "@/constants/filters";
import React, { useState } from "react";
import { Button } from "../ui/button";
// import { useRouter, useSearchParams } from "next/navigation";
// import { formUrlQuery } from "@/lib/utils";

const HomeFilters = () => {
  const active = "";
  // const searchParams = useSearchParams();
  // const router = useRouter();

  // const [active, setActive] = useState("");

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => {}}
          className={`body-me dium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === item.value
              ? "bg-primary-100 text-primary-500"
              : "bg-light-800 text-light-500"
          }`}
          onClickCapture={() => {}}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
