// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import api from "../services/api"
// import { useToast } from "../contexts/ToastContext"
// import Header from "../components/layout/Header"
// import PlantInfo from "../components/plants/PlantInfo"
// import PlantActions from "../components/plants/PlantActions"
// // import SensorDataChart from "../components/plants/SensorDataChart" // ไม่ใช้ chart ตอน mock
// import { getPlantCareRecommendations } from "../services/plant-ai-service"

// const PlantDetailsPage = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { addToast } = useToast()
//   const [plant, setPlant] = useState(null)
//   const [sensorData, setSensorData] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // 1. ดึงข้อมูลต้นไม้
//         const plantResponse = await api.get(`/api/plants/${id}`)
//         const plantData = plantResponse.data
//         setPlant(plantData)

//         // 2. ขอคำแนะนำการดูแลจาก AI
//         const careRecommendation = await getPlantCareRecommendations(plantData.species)

//         // 3. จำลอง sensor data
//         const mockSensorData = [
//           {
//             timestamp: new Date().toISOString(),
//             moistureLevel: 65,
//             lightLevel: 70,
//             temperature: 27,
//             npkNitrogen: 40,
//             npkPhosphorus: 30,
//             npkPotassium: 20,
//             careRecommendation,
//           }
//         ]

//         setSensorData(mockSensorData)
//       } catch (error) {
//         addToast({
//           title: "เกิดข้อผิดพลาด",
//           message: "ไม่สามารถโหลดข้อมูลต้นไม้ได้",
//           type: "error",
//         })
//         navigate("/dashboard")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [id, navigate, addToast])

//   const handleWater = async () => {
//     try {
//       await api.post(`/api/plants/${id}/activities`, {
//         activityType: "watering",
//         notes: "รดน้ำต้นไม้",
//       })

//       addToast({
//         title: "รดน้ำเสร็จแล้ว",
//         message: "ต้นไม้ของคุณได้รับน้ำแล้ว",
//         type: "success",
//       })
//     } catch (error) {
//       addToast({
//         title: "เกิดข้อผิดพลาด",
//         message: "ไม่สามารถรดน้ำต้นไม้ได้",
//         type: "error",
//       })
//     }
//   }

//   const handleFertilize = async () => {
//     try {
//       await api.post(`/api/plants/${id}/activities`, {
//         activityType: "fertilizing",
//         notes: "ใส่ปุ๋ยต้นไม้",
//       })

//       addToast({
//         title: "ใส่ปุ๋ยเสร็จสิ้น",
//         message: "ใส่ปุ๋ยเสร็จสิ้น แล้วกลับมาใส่ใหม่ในครั้งถัดไป",
//         type: "success",
//       })
//     } catch (error) {
//       addToast({
//         title: "เกิดข้อผิดพลาด",
//         message: "ไม่สามารถใส่ปุ๋ยต้นไม้ได้",
//         type: "error",
//       })
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <p>กำลังโหลด...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header
//         title={plant.name}
//         showBackButton
//         backTo="/dashboard"
//         showHistoryButton
//         historyTo={`/plants/${id}/history`}
//       />

//       <main className="container mx-auto px-4 py-6">
//         <PlantInfo plant={plant} />

//         <div className="mt-6">
//           <h2 className="text-xl font-semibold mb-4">ข้อมูลเซ็นเซอร์ (จำลอง)</h2>
//           {sensorData.length > 0 ? (
//             <div className="bg-white rounded-lg shadow p-6 text-gray-700 space-y-2">
//               <p>🌱 ความชื้นในดิน: {sensorData[0].moistureLevel}%</p>
//               <p>🌞 แสง: {sensorData[0].lightLevel}%</p>
//               <p>🌡️ อุณหภูมิ: {sensorData[0].temperature}°C</p>
//               <p>🧪 N: {sensorData[0].npkNitrogen}</p>
//               <p>🧪 P: {sensorData[0].npkPhosphorus}</p>
//               <p>🧪 K: {sensorData[0].npkPotassium}</p>
//               <p className="mt-4 text-green-700 font-semibold">
//                 💡 คำแนะนำจาก AI: {sensorData[0].careRecommendation}
//               </p>
//             </div>
//           ) : (
//             <div className="bg-white rounded-lg shadow p-6 text-center">
//               <p className="text-gray-500">ยังไม่มีข้อมูลเซ็นเซอร์</p>
//             </div>
//           )}
//         </div>

//         <PlantActions onWater={handleWater} onFertilize={handleFertilize} />
//       </main>
//     </div>
//   )
// }

// export default PlantDetailsPage















//frontend\src\pages\PlantDetailsPage.js

"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import { useToast } from "../contexts/ToastContext"
import Header from "../components/layout/Header"
import PlantInfo from "../components/plants/PlantInfo"
import PlantActions from "../components/plants/PlantActions"
// import SensorDataChart from "../components/plants/SensorDataChart" // ไม่ใช้ chart ตอน mock

// ** ไม่จำเป็นต้อง import getPlantCareRecommendations อีกต่อไปเมื่อใช้ mock data
// import { getPlantCareRecommendations } from "../services/plant-ai-service"

const PlantDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [plant, setPlant] = useState(null)
  const [sensorData, setSensorData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. ดึงข้อมูลต้นไม้
        const plantResponse = await api.get(`/api/plants/${id}`)
        const plantData = plantResponse.data
        setPlant(plantData)

        // ** 2. สร้างคำแนะนำการดูแลแบบจำลอง (Mock AI Recommendation) แทนการเรียก AI จริง **
        const mockCareRecommendation = `
        **คำแนะนำสำหรับ ${plantData.species} (จำลอง):**

        1.  **ความต้องการน้ำ:** ประมาณ 60-70% (รดน้ำเมื่อดินผิวหน้าเริ่มแห้ง)
        2.  **ความต้องการแสง:** ประมาณ 75% (แสงแดดปานกลางถึงแสงแดดจัด แต่ควรหลีกเลี่ยงแสงแดดจัดตรงๆ ในช่วงบ่าย)
        3.  **ความต้องการปุ๋ย:** ประมาณ 50% (ใส่ปุ๋ยสูตรเสมอเดือนละครั้งในช่วงฤดูเจริญเติบโต)
        4.  **ปัญหาทั่วไป:**
            * **ใบเหลือง:** อาจเกิดจากการรดน้ำมากเกินไปหรือน้อยเกินไป
            * **แมลงศัตรูพืช:** ตรวจสอบสม่ำเสมอและกำจัดด้วยวิธีธรรมชาติ
        5.  **เคล็ดลับพิเศษ:**
            * ควรหมุนกระถางเป็นประจำเพื่อให้ได้รับแสงสม่ำเสมอ
            * พรวนดินเบาๆ เพื่อเพิ่มการระบายอากาศ
        `.trim(); // ใช้ .trim() เพื่อลบช่องว่างหัวท้าย

        // 3. จำลอง sensor data (และรวม careRecommendation เข้าไปด้วย)
        const mockSensorData = [
          {
            timestamp: new Date().toISOString(),
            moistureLevel: 65,
            lightLevel: 70,
            temperature: 27,
            npkNitrogen: 40,
            npkPhosphorus: 30,
            npkPotassium: 20,
            careRecommendation: mockCareRecommendation, // ใช้คำแนะนำที่สร้างขึ้นเอง
          },
        ];

        setSensorData(mockSensorData);
      } catch (error) {
        console.error("Error loading plant details or mock data:", error); // เพิ่ม console.error เพื่อ debug ได้ดีขึ้น
        addToast({
          title: "เกิดข้อผิดพลาด",
          message: "ไม่สามารถโหลดข้อมูลต้นไม้ได้",
          type: "error",
        });
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, addToast]);

  const handleWater = async () => {
    try {
      await api.post(`/api/plants/${id}/activities`, {
        activityType: "watering",
        notes: "รดน้ำต้นไม้",
      });

      addToast({
        title: "รดน้ำเสร็จแล้ว",
        message: "ต้นไม้ของคุณได้รับน้ำแล้ว",
        type: "success",
      });
    } catch (error) {
      addToast({
        title: "เกิดข้อผิดพลาด",
        message: "ไม่สามารถรดน้ำต้นไม้ได้",
        type: "error",
      });
    }
  };

  const handleFertilize = async () => {
    try {
      await api.post(`/api/plants/${id}/activities`, {
        activityType: "fertilizing",
        notes: "ใส่ปุ๋ยต้นไม้",
      });

      addToast({
        title: "ใส่ปุ๋ยเสร็จสิ้น",
        message: "ใส่ปุ๋ยเสร็จสิ้น แล้วกลับมาใส่ใหม่ในครั้งถัดไป",
        type: "success",
      });
    } catch (error) {
      addToast({
        title: "เกิดข้อผิดพลาด",
        message: "ไม่สามารถใส่ปุ๋ยต้นไม้ได้",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>กำลังโหลด...</p>
      </div>
    );
  }
  console.log("Image URL:", plant.imageUrl);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={plant.name}
        showBackButton
        backTo="/dashboard"
        showHistoryButton
        historyTo={`/plants/${id}/history`}
      />

      <main className="container mx-auto px-4 py-6">
        <PlantInfo plant={plant} />

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">ข้อมูลเซ็นเซอร์ (จำลอง)</h2>
          {sensorData.length > 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-gray-700 space-y-2">
              <p>🌱 ความชื้นในดิน: {sensorData[0].moistureLevel}%</p>
              <p>🌞 แสง: {sensorData[0].lightLevel}%</p>
              <p>🌡️ อุณหภูมิ: {sensorData[0].temperature}°C</p>
              <p>🧪 N: {sensorData[0].npkNitrogen}</p>
              <p>🧪 P: {sensorData[0].npkPhosphorus}</p>
              <p>🧪 K: {sensorData[0].npkPotassium}</p>
              <p className="mt-4 text-green-700 font-semibold whitespace-pre-line">
                {/* ใช้ whitespace-pre-line เพื่อให้ข้อความขึ้นบรรทัดใหม่ตาม \n */}
                💡 คำแนะนำจาก AI: {sensorData[0].careRecommendation}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">ยังไม่มีข้อมูลเซ็นเซอร์</p>
            </div>
          )}
        </div>

        <PlantActions onWater={handleWater} onFertilize={handleFertilize} />
      </main>
    </div>
  );
};

export default PlantDetailsPage;