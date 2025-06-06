import React, { useCallback, useEffect, useRef, useState } from "react";
import { load } from "@2gis/mapgl";
import { Clusterer } from "@2gis/mapgl-clusterer";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrees } from "../store/trees/treeThunks";
import AddTreeModal from "../components/AddTreeModal";
import { message } from "antd";
import AddTreeButton from "../components/AddTreeButton";
import { useSearchParams } from "react-router-dom";

const Map = () => {
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const clustererRef = useRef(null);

  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.trees);
  const { user } = useSelector((state) => state.auth);

  const [isAddTreeModalOpen, setIsAddTreeModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState(null);

  const mapCenter = [40.3949328, 56.126434];

  //Открытие дерева при переходе с детальной страницы
  const [searchParams] = useSearchParams();
  const lat = parseFloat(searchParams.get("lat"));
  const lng = parseFloat(searchParams.get("lng"));

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

      //Открытие дерева при переходе с детальной страницы
      if (!isNaN(lat) && !isNaN(lng)) {
        // Просто центрируем карту на существующее дерево
        map.setCenter([lng, lat]);
        map.setZoom(18);
      }

      map.on("click", async (event) => {
        const coordinates = event.lngLat;

        if (markerRef.current) markerRef.current.destroy();
        markerRef.current = new mapglAPI.Marker(map, {
          coordinates: [coordinates[0], coordinates[1]],
        });

        const coords = {
          lat: coordinates[1],
          lng: coordinates[0],
        };
        console.log("coord", coords);

        const address = await getAddressFromCoords(coords.lng, coords.lat);

        map.setCenter(coordinates);

        setModalProps({ coords, address });
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
      const item = data?.result?.items?.[0];
      console.log("adress", data);

      if (item?.address_name) {
        return item.address_name;
      }
      return "Адрес не найден";
    } catch (error) {
      console.error("Ошибка при получении адреса:", error);
      return "Ошибка определения адреса";
    }
  };

  const resetMapState = useCallback(() => {
    if (markerRef.current) markerRef.current.destroy();
    markerRef.current = null;
    setModalProps(null);
  }, []);

  const handleCloseAddTreeModal = () => {
    setIsAddTreeModalOpen(false);
    resetMapState();
  };

  const handleOpenAddTreeModal = () => {
    if (!modalProps) {
      message.warning("Сначала выберите место на карте");
      return;
    }
    setIsAddTreeModalOpen(true);
  };

  return (
    <>
      <AddTreeButton onClick={handleOpenAddTreeModal} />
      <div id="map-container" style={{ width: "100vw", height: "100vh" }}></div>
      <AddTreeModal
        isOpen={isAddTreeModalOpen}
        onClose={handleCloseAddTreeModal}
        initialCoords={modalProps?.coords || null}
        initialAddress={modalProps?.address || ""}
      />
    </>
  );
};

export default Map;
