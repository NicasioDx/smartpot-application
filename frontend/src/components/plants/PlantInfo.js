import React, { useEffect, useState } from "react";
import axios from "axios";

const PlantInfo = ({ plant }) => {
  const sensorData = plant.sensorData || {};
  const careValues = plant.careValues || {};

  const [aiValues, setAiValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!plant.species) return;

    setLoading(true);
    setError(null);

    axios
      .post("http://localhost:5000/api/aiRecommendation/recommend-values", {
        species: plant.species,
      })
      .then((res) => {
        setAiValues(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch AI recommendation:", err);
        setError("ไม่สามารถโหลดค่าที่แนะนำจาก AI ได้");
        setLoading(false);
      });
  }, [plant.species]);

  // Sensor values only
  const sensorMoistureLevel = sensorData.moistureLevel ?? 50;
  const sensorLightLevel = sensorData.lightLevel ?? 50;
  const sensorNitrogen = sensorData.npkNitrogen ?? 50;
  const sensorPhosphorus = sensorData.npkPhosphorus ?? 50;
  const sensorPotassium = sensorData.npkPotassium ?? 50;
  const sensorTemperature = sensorData.temperature ?? 50;

  // AI values only
  const aiMoistureLevel = aiValues?.moistureLevel ?? null;
  const aiLightLevel = aiValues?.lightLevel ?? null;
  const aiNitrogen = aiValues?.npkNitrogen ?? null;
  const aiPhosphorus = aiValues?.npkPhosphorus ?? null;
  const aiPotassium = aiValues?.npkPotassium ?? null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="aspect-square rounded-lg overflow-hidden">
            <img
              src={`http://localhost:5000${plant.imageUrl}`}
              alt={plant.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="md:w-2/3">
          <h1 className="text-2xl font-bold mb-2">{plant.name}</h1>
          {plant.species && <p className="text-gray-500 mb-4">{plant.species}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Moisture and Light from sensor */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">ความชื้น</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${sensorMoistureLevel}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-gray-500 mt-1">
                {sensorMoistureLevel.toFixed(1)}%
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">แสง</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-yellow-400 h-2.5 rounded-full"
                  style={{ width: `${sensorLightLevel}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-gray-500 mt-1">
                {sensorLightLevel.toFixed(1)}%
              </p>
            </div>

            {/* AI Recommendation Only */}
            <div className="border rounded-lg p-4 text-sm space-y-2">
              <h3 className="font-medium mb-2">ค่าที่แนะนำจาก AI</h3>

              {loading && <p>กำลังโหลดค่าที่แนะนำจาก AI...</p>}
              {error && <p className="text-red-500">{error}</p>}

              {!loading && !error && aiValues && (
                <>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>🌱 ความชื้นในดิน</span>
                      <span>{aiMoistureLevel?.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${aiMoistureLevel}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>🌞 แสง</span>
                      <span>{aiLightLevel?.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-yellow-400 h-1.5 rounded-full"
                        style={{ width: `${aiLightLevel}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>🧪 N</span>
                      <span>{aiNitrogen?.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${aiNitrogen}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>🧪 P</span>
                      <span>{aiPhosphorus?.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${aiPhosphorus}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>🧪 K</span>
                      <span>{aiPotassium?.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${aiPotassium}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sensor minerals only */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">แร่ธาตุในดิน</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>ไนโตรเจน (N)</span>
                    <span>{sensorNitrogen.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-600 h-1.5 rounded-full"
                      style={{ width: `${sensorNitrogen}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>ฟอสฟอรัส (P)</span>
                    <span>{sensorPhosphorus.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-600 h-1.5 rounded-full"
                      style={{ width: `${sensorPhosphorus}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>โพแทสเซียม (K)</span>
                    <span>{sensorPotassium.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-600 h-1.5 rounded-full"
                      style={{ width: `${sensorPotassium}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {plant.careRecommendations && (
            <div className="mt-4 border rounded-lg p-4">
              <h3 className="font-medium mb-2">คำแนะนำในการดูแล</h3>
              <p className="text-sm whitespace-pre-line">{plant.careRecommendations}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantInfo;
