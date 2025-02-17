"use client";

import { useState, useEffect } from "react";
// หากคุณไม่ได้ใช้ Input/Card จากที่ไหน ก็แก้เป็น <input>, <div> ตามปกติ หรือคัดลอก Component เหล่านั้นมาด้วย
import { Input } from "./ui/Input";
import { Card, CardContent } from "./ui/card";

export default function ProvinceSearch() {
  const [search, setSearch] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [filteredProvinces, setFilteredProvinces] = useState([]);

  useEffect(() => {
    // ดึงข้อมูลจากไฟล์ province_data.json ใน public/ หรือโฟลเดอร์เดียวกัน
    // หากไฟล์อยู่ใน public/ path จะเป็น "/province_data.json"
    fetch("/province_data.json")
      .then((res) => res.json())
      .then((data) => {
        const structuredData = {};
        data.forEach((entry) => {
          // แยก provinceKey (หลังเครื่องหมาย #)
          const provinceKey = entry.subject.split("#")[1];

          if (!structuredData[provinceKey]) {
            structuredData[provinceKey] = {};
          }

          // แยก predicateKey (หลังเครื่องหมาย #)
          const predicateKey = entry.predicate.split("#")[1];

          // เก็บค่า object ไว้ใน structuredData[provinceKey][predicateKey]
          structuredData[provinceKey][predicateKey] = entry.object;
        });

        // สร้างเป็น array ของ [key, valueObj] เพื่อสะดวกในการ map
        setProvinces(Object.entries(structuredData));
      });
  }, []);

  // ฟิลเตอร์รายการจังหวัดเมื่อ search หรือ provinces เปลี่ยน
  useEffect(() => {
    setFilteredProvinces(
      provinces.filter(([key, data]) => {
        const searchLower = search.toLowerCase();
        const keyMatch = key.toLowerCase().includes(searchLower);
        const nameMatch =
          data.hasNameOfProvince &&
          data.hasNameOfProvince.toLowerCase().includes(searchLower);
        return keyMatch || nameMatch;
      })
    );
  }, [search, provinces]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* ช่องค้นหา */}
      <Input
        placeholder="ค้นหาจังหวัด..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      <div className="space-y-4">
        {/* วนแสดงผลแต่ละจังหวัด */}
        {filteredProvinces.map(([key, data]) => (
          <Card key={key} className="p-4">
            <CardContent>
              {/* แสดงชื่อจังหวัด (hasNameOfProvince) หรือใช้ key */}
              <h2 className="text-xl font-bold">
                {data.hasNameOfProvince || key}
              </h2>

              {/* แสดงคำขวัญ (hasMotto) */}
              {data.hasMotto && (
                <p className="text-gray-600">{data.hasMotto}</p>
              )}

              {/* แสดงรูปถ้ามี (hasImageOfProvince) */}
              {data.hasImageOfProvince && (
                <img
                  src={`/${data.hasImageOfProvince}`}
                  alt={key}
                  className="w-full h-40 object-cover mt-2 rounded-lg"
                />
              )}

              {/* แสดงลิงก์ไปยังเว็บไซต์ (hasURLOfProvince) */}
              {data.hasURLOfProvince && (
                <a
                  href={data.hasURLOfProvince}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 mt-2 block"
                >
                  เว็บไซต์ทางการ
                </a>
              )}

              {/* --- เพิ่มเติม: วนลูปแสดงทุกฟิลด์อื่น ๆ ที่เหลือ --- */}
              <hr className="my-2" />
              <div className="text-sm text-gray-800">
                {Object.entries(data).map(([fieldKey, fieldVal]) => {
                  // ถ้าเป็นฟิลด์หลักที่แสดงด้านบนแล้ว เราข้ามก็ได้
                  // เพื่อไม่ให้ซ้ำสอง
                  if (
                    ["hasNameOfProvince", "hasMotto", "hasImageOfProvince", "hasURLOfProvince"].includes(fieldKey)
                  ) {
                    return null;
                  }

                  return (
                    <p key={fieldKey}>
                      {/* แสดงชื่อ fieldKey + ค่า fieldVal */}
                      <strong>{fieldKey}:</strong> {fieldVal}
                    </p>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
