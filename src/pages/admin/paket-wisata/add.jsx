import Sidebar from "@/components/Sidebar";
import axiosInstance from "@/config/axiosInstance";
import AuthPage from "@/hoc/AuthPage";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";

const initInput = {
  nama_paket: "",
  deskripsi: "",
  id_rm: 0,
  id_hotel: 0,
  id_kendaraan: 0,
  harga: 0,
  id_wisata: 0,
};

const AddPaketWisataPage = () => {
  const router = useRouter();
  const [formInput, setFormInput] = useState(initInput);
  const [errors, setErrors] = useState({});
  const [rumahMakanList, setRumahMakanList] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [kendaraanList, setKendaraanList] = useState([]);
  const [wisataList, setWisataList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data dropdown
  const fetchDropdownData = async () => {
    try {
      const [rmResponse, hotelResponse, kendaraanResponse, wisataResponse] =
        await Promise.all([
          axiosInstance.get("/getRumahMakan"),
          axiosInstance.get("/getHotel"),
          axiosInstance.get("/getKendaraan"),
          axiosInstance.get("/getWisata"),
        ]);

      setRumahMakanList(rmResponse.data);
      setHotelList(hotelResponse.data);
      setKendaraanList(kendaraanResponse.data);
      setWisataList(wisataResponse.data);
    } catch (error) {
      console.log("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Validate form input
  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!formInput.nama_paket) {
      valid = false;
      newErrors.nama_paket = "Nama paket harus diisi";
    }
    if (!formInput.deskripsi) {
      valid = false;
      newErrors.deskripsi = "Deskripsi harus diisi";
    }
    if (formInput.harga <= 0) {
      valid = false;
      newErrors.harga = "Harga harus lebih dari 0";
    }
    if (!formInput.id_rm) {
      valid = false;
      newErrors.id_rm = "Pilih rumah makan";
    }
    if (!formInput.id_hotel) {
      valid = false;
      newErrors.id_hotel = "Pilih hotel";
    }
    if (!formInput.id_kendaraan) {
      valid = false;
      newErrors.id_kendaraan = "Pilih kendaraan";
    }
    if (!formInput.id_wisata) {
      valid = false;
      newErrors.id_wisata = "Pilih wisata";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await axiosInstance.post("/addPaketWisata", formInput);
      router.push("/admin/paket-wisata");
    } catch (error) {
      console.log("Error adding paket wisata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sidebar>
      <Box className="p-8 bg-white shadow-lg rounded-lg max-w-3xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-6">Tambah Paket Wisata</h1>
        <form>
          <TextField
            label="Nama Paket"
            name="nama_paket"
            value={formInput.nama_paket}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.nama_paket}
            helperText={errors.nama_paket}
          />
          <TextField
            label="Deskripsi"
            name="deskripsi"
            value={formInput.deskripsi}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            error={!!errors.deskripsi}
            helperText={errors.deskripsi}
          />
          <TextField
            label="Harga"
            name="harga"
            type="number"
            value={formInput.harga}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.harga}
            helperText={errors.harga}
          />
          {/* Dropdown Rumah Makan */}
          <FormControl fullWidth margin="normal" error={!!errors.id_rm}>
            <InputLabel id="select-rm-label">Rumah Makan</InputLabel>
            <Select
              labelId="select-rm-label"
              name="id_rm"
              value={formInput.id_rm}
              onChange={handleChange}
            >
              {rumahMakanList.map((rm) => (
                <MenuItem key={rm.id_rm} value={rm.id_rm}>
                  {rm.nama_rm}
                </MenuItem>
              ))}
            </Select>
            {errors.id_rm && <FormHelperText>{errors.id_rm}</FormHelperText>}
          </FormControl>
          {/* Dropdown Hotel */}
          <FormControl fullWidth margin="normal" error={!!errors.id_hotel}>
            <InputLabel id="select-hotel-label">Hotel</InputLabel>
            <Select
              labelId="select-hotel-label"
              name="id_hotel"
              value={formInput.id_hotel}
              onChange={handleChange}
            >
              {hotelList.map((hotel) => (
                <MenuItem key={hotel.id_hotel} value={hotel.id_hotel}>
                  {hotel.nama_hotel}
                </MenuItem>
              ))}
            </Select>
            {errors.id_hotel && (
              <FormHelperText>{errors.id_hotel}</FormHelperText>
            )}
          </FormControl>
          {/* Dropdown Kendaraan */}
          <FormControl fullWidth margin="normal" error={!!errors.id_kendaraan}>
            <InputLabel id="select-kendaraan-label">Kendaraan</InputLabel>
            <Select
              labelId="select-kendaraan-label"
              name="id_kendaraan"
              value={formInput.id_kendaraan}
              onChange={handleChange}
            >
              {kendaraanList.map((kendaraan) => (
                <MenuItem
                  key={kendaraan.id_kendaraan}
                  value={kendaraan.id_kendaraan}
                >
                  {kendaraan.nama_kendaraan}
                </MenuItem>
              ))}
            </Select>
            {errors.id_kendaraan && (
              <FormHelperText>{errors.id_kendaraan}</FormHelperText>
            )}
          </FormControl>
          {/* Dropdown Wisata */}
          <FormControl fullWidth margin="normal" error={!!errors.id_wisata}>
            <InputLabel id="select-wisata-label">Wisata</InputLabel>
            <Select
              labelId="select-wisata-label"
              name="id_wisata"
              value={formInput.id_wisata}
              onChange={handleChange}
            >
              {wisataList.map((wisata) => (
                <MenuItem key={wisata.id_wisata} value={wisata.id_wisata}>
                  {wisata.nama_wisata}
                </MenuItem>
              ))}
            </Select>
            {errors.id_wisata && (
              <FormHelperText>{errors.id_wisata}</FormHelperText>
            )}
          </FormControl>

          <div className="mt-6 flex justify-end gap-4">
            <Button
              variant="outlined"
              onClick={() => router.push("/admin/paket-wisata")}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </Box>
    </Sidebar>
  );
};

export default AuthPage(AddPaketWisataPage);
