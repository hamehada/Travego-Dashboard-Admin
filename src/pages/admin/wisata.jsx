import Sidebar from "@/components/Sidebar";
import axiosInstance from "@/config/axiosInstance";
import AuthPage from "@/hoc/AuthPage";
import formatRupiah from "@/utils/formatRupiah";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const FIELDS = ["No", "", "Wisata", "Lokasi", "Harga", "Aksi"];

const initInput = {
  id_wisata: 0,
  nama_wisata: "",
  lokasi: "",
  harga_tiket: 0,
  gambar_wisata: null,
};

const WisataPage = () => {
  const [data, setData] = useState([]);
  const [formInput, setFormInput] = useState(initInput);
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchData = async () => {
    const response = await axiosInstance.get("/getWisata");
    setData(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    setOpen(false);
    setFormInput(initInput);
    setSelectedImage(null);
  };

  const handleCloseConfirm = () => {
    setConfirm(false);
    setFormInput(initInput);
  };

  const handleConfirmation = (data) => {
    setFormInput(data);
    setConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/deleteWisata/${formInput.id_wisata}`);
      fetchData();
      handleCloseConfirm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  }, [isError]);

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setFormInput((prevState) => ({
      ...prevState,
      gambar_wisata: file,
    }));
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formInput.gambar_wisata ||
      formInput.harga_tiket === 0 ||
      formInput.lokasi === "" ||
      formInput.nama_wisata === ""
    ) {
      setIsError("Lengkapi semua data");
      return;
    }
    try {
      if (formInput.id_wisata === 0) {
        const formData = new FormData();
        formData.append("nama_wisata", formInput.nama_wisata);
        formData.append("lokasi", formInput.lokasi);
        formData.append("harga_tiket", formInput.harga_tiket);
        formData.append("gambar_wisata", formInput.gambar_wisata);
        await axiosInstance.post("/addWisata", formData);
        handleClose();
      } else {
        if (selectedImage) {
          const formData = new FormData();
          formData.append("id_wisata", formInput.id_wisata);
          formData.append("nama_wisata", formInput.nama_wisata);
          formData.append("lokasi", formInput.lokasi);
          formData.append("harga_tiket", formInput.harga_tiket);
          formData.append("gambar_wisata", formInput.gambar_wisata);
          await axiosInstance.put(
            `/editWisata/${formInput.id_wisata}`,
            formData
          );
        } else {
          await axiosInstance.put(
            `/editWisata/${formInput.id_wisata}`,
            formInput
          );
        }
        handleClose();
      }
    } catch (error) {
      console.log(error);
      setIsError("Terjadi kesalahan");
    } finally {
      fetchData();
    }
  };

  return (
    <>
      <Sidebar onClick={() => setOpen(true)}>
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                {FIELDS.map((field, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                  >
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={item.id_wisata}>
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4">
                    <Image
                      src={item.gambar_wisata}
                      alt={item.nama_wisata}
                      className="w-16 h-16 object-cover"
                      width={100}
                      height={100}
                    />
                  </td>
                  <td className="px-6 py-4">{item.nama_wisata}</td>
                  <td className="px-6 py-4">{item.lokasi}</td>
                  <td className="px-6 py-4">
                    {formatRupiah(item.harga_tiket)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => {
                        setOpen(true);
                        setFormInput(item);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="ml-4 text-red-600 hover:text-red-900"
                      onClick={() => handleConfirmation(item)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sidebar>
      <Modal
        open={open}
        onClose={handleClose}
        className="flex justify-center items-center overflow-y-auto"
      >
        <Box className="relative p-8 bg-white shadow-lg rounded-lg w-[90%] md:w-2/3 lg:w-1/2 xl:w-1/3 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            {formInput.id_wisata > 0 ? "Edit" : "Tambah"} Wisata
          </h2>
          <form>
            <TextField
              label="Nama Wisata"
              name="nama_wisata"
              value={formInput.nama_wisata}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Lokasi Wisata"
              name="lokasi"
              value={formInput.lokasi}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Harga Wisata"
              name="harga_tiket"
              value={formInput.harga_tiket}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            {formInput.id_wisata === 0 ? (
              <Input
                label="Gambar Wisata"
                type="file"
                name="gambar_wisata"
                onChange={(e) =>
                  setFormInput((prevState) => ({
                    ...prevState,
                    gambar_wisata: e.target.files[0],
                  }))
                }
                fullWidth
                margin="normal"
              />
            ) : (
              <div className="w-full h-full">
                <Image
                  src={selectedImage ? selectedImage : formInput.gambar_wisata}
                  alt={formInput.nama_wisata}
                  className="w-full h-full object-cover"
                  width={500}
                  height={500}
                />
                <input
                  type="file"
                  name="gambar_wisata"
                  id="image-edit"
                  onChange={handleChangeImage}
                  className="hidden"
                />
                <Button
                  onClick={() => {
                    document.getElementById("image-edit").click();
                  }}
                >
                  Ganti Gambar
                </Button>
              </div>
            )}
            {isError && (
              <p className="mt-2 text-sm text-red-500">{isError.toString()}</p>
            )}
            <div className="mt-4 flex gap-2 justify-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Simpan
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClose}
                className="ml-2"
              >
                Batal
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      <Dialog open={confirm} onClose={handleCloseConfirm}>
        <DialogTitle>Apakah anda yakin ingin menghapus wisata ini?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Setelah di hapus, data tidak dapat dikembalikan
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Disagree</Button>
          <Button onClick={handleDelete} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AuthPage(WisataPage);
