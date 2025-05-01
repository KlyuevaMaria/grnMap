import React, { useEffect, useRef, useState } from "react";
import { load } from "@2gis/mapgl";
import { Clusterer } from "@2gis/mapgl-clusterer";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrees } from "../store/trees/treeThunks";
import AddTreeModal from "../components/AddTreeModal";

const Map = () => {
  const mapInstanceRef = useRef(null);
  const clustererRef = useRef(null);
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.trees);

  const mapCenter = [40.3949328, 56.126434];

  const [isAddTreeModalOpen, setIsAddTreeModalOpen] = useState(false);
  const [newTreeCoords, setNewTreeCoords] = useState(null);
  const [newTreeAddress, setNewTreeAddress] = useState("");

  useEffect(() => {
    dispatch(fetchTrees());

    load().then(() => {
      const mapglAPI = window.mapgl;

      const map = new mapglAPI.Map("map-container", {
        center: mapCenter,
        zoom: 14,
        key: "592dca93-79b5-47c8-b149-e8bf215b0fd2",
      });

      mapInstanceRef.current = map;

      clustererRef.current = new Clusterer(map, {
        radius: 40,
        minZoom: 0,
        maxZoom: 22,
        clusterIconLayout: "default#pieChart",
        clusterIconPieChartRadius: 25,
        clusterIconPieChartCoreRadius: 10,
      });

      // Клик по карте - открытие формы добавления
      map.on("click", (event) => {
        const coords = event.lngLat;
        console.log("COORDS", coords);

        setNewTreeCoords({
          lat: coords[1],
          lng: coords[0],
        });
        setIsAddTreeModalOpen(true);
      });
    });

    return () => {
      if (clustererRef.current) clustererRef.current.destroy();
      if (mapInstanceRef.current) mapInstanceRef.current.destroy();
    };
  }, [dispatch]);

  useEffect(() => {
    if (mapInstanceRef.current && clustererRef.current && list.length > 0) {
      const markersData = list.map((tree) => ({
        coordinates: [tree.longitude, tree.latitude],
        treeData: tree,
      }));

      clustererRef.current.load(markersData);
    }
  }, [list]);

  const getAddressFromCoords = async (longitude, latitude) => {
    try {
      const response = await fetch(
        `https://catalog.api.2gis.com/3.0/items/geocode?point=${longitude},${latitude}&key=592dca93-79b5-47c8-b149-e8bf215b0fd2`
      );
      const data = await response.json();
      if (data?.result?.items?.[0]?.full_name) {
        return data.result.items[0].full_name;
      }
      console.log(data);

      return "Адрес не найден";
    } catch (error) {
      console.error("Ошибка при получении адреса:", error);
      return "Ошибка определения адреса";
    }
  };

  useEffect(() => {
    if (newTreeCoords) {
      const fetchAddress = async () => {
        const addr = await getAddressFromCoords(
          newTreeCoords.lng,
          newTreeCoords.lat
        );
        setNewTreeAddress(addr);
      };
      fetchAddress();
    }
  }, [newTreeCoords]);

  return (
    <>
      <div id="map-container" style={{ width: "100vw", height: "100vh" }}></div>
      <AddTreeModal
        isOpen={isAddTreeModalOpen}
        onClose={() => setIsAddTreeModalOpen(false)}
        initialCoords={newTreeCoords}
        // initialAddress={newTreeAddress}
      />
    </>
  );
};

export default Map;
