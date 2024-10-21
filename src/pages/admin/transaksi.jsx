import Sidebar from "@/components/Sidebar";
import axiosInstance from "@/config/axiosInstance";
import AuthPage from "@/hoc/AuthPage";
import formatDate from "@/utils/formatDate";
import formatRupiah from "@/utils/formatRupiah";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
} from "@mui/material";

const FIELDS = ["No", "Pemesan", "Paket", "Total", "Dibuat Pada", "Aksi"];

const TransaksiPage = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/getTransaksi");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (transaksi) => {
    setSelectedTransaksi(transaksi);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedTransaksi(null);
  };

  return (
    <Sidebar>
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
              <tr key={item.id_pesanan}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold">{item.user.nama}</span>
                    <span>{item.user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{item.paket.nama_paket}</td>
                <td className="px-6 py-4">{formatRupiah(item.total)}</td>
                <td className="px-6 py-4">{formatDate(item.tgl_pesanan)}</td>
                <td className="px-6 py-4">
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => handleOpenModal(item)}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Detail Transaksi */}
      <Modal open={open} onClose={handleCloseModal} className="flex justify-center items-center overflow-y-auto">
        <Box className="bg-white p-8 rounded-lg shadow-lg w-[90%] md:w-2/3 lg:w-1/2 xl:w-1/3 max-h-[80vh] overflow-y-auto">
          {selectedTransaksi && (
            <>
              <Typography variant="h6" className="font-bold mb-4">
                Detail Transaksi
              </Typography>
              <Typography variant="subtitle1" className="mb-2">
                <strong>Pemesan:</strong> {selectedTransaksi.user.nama} ({selectedTransaksi.user.email})
              </Typography>
              <Typography variant="subtitle1" className="mb-2">
                <strong>Nomor HP:</strong> {selectedTransaksi.user.no_hp}
              </Typography>
              <Typography variant="subtitle1" className="mb-2">
                <strong>Tanggal Pesanan:</strong> {formatDate(selectedTransaksi.tgl_pesanan)}
              </Typography>
              <Typography variant="subtitle1" className="mb-2">
                <strong>Catatan:</strong> {selectedTransaksi.catatan || "-"}
              </Typography>
              <Typography variant="subtitle1" className="mb-2">
                <strong>Jumlah:</strong> {selectedTransaksi.detail_pesanan.qty}
              </Typography>
              <Typography variant="subtitle1" className="mb-2">
                <strong>Harga:</strong> {formatRupiah(selectedTransaksi.detail_pesanan.harga)}
              </Typography>
              <Typography variant="subtitle1" className="mb-2">
                <strong>Total:</strong> {formatRupiah(selectedTransaksi.total)}
              </Typography>

              <div className="mt-4">
                <Typography variant="subtitle1" className="font-bold mb-2">
                  Paket: {selectedTransaksi.paket.nama_paket}
                </Typography>                
                <div className="mb-4">
                  <Typography variant="subtitle1" className="font-bold mb-2">
                    Hotel
                  </Typography>
                  <div className="flex items-center gap-4">
                    <Image
                      src={selectedTransaksi.paket.hotel.gambar_hotel}
                      alt={selectedTransaksi.paket.hotel.nama_hotel}
                      className="w-16 h-16 object-cover"
                      width={64}
                      height={64}
                    />
                    <div>
                      <Typography variant="body2">
                        <strong>Nama:</strong> {selectedTransaksi.paket.hotel.nama_hotel}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Alamat:</strong> {selectedTransaksi.paket.hotel.alamat_hotel}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Harga Kamar:</strong> {formatRupiah(selectedTransaksi.paket.hotel.harga_kamar)}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <Typography variant="subtitle1" className="font-bold mb-2">
                    Kendaraan
                  </Typography>
                  <div className="flex items-center gap-4">
                    <Image
                      src={selectedTransaksi.paket.kendaraan.gambar_kendaraan}
                      alt={selectedTransaksi.paket.kendaraan.nama_kendaraan}
                      className="w-16 h-16 object-cover"
                      width={64}
                      height={64}
                    />
                    <div>
                      <Typography variant="body2">
                        <strong>Nama:</strong> {selectedTransaksi.paket.kendaraan.nama_kendaraan}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Tipe:</strong> {selectedTransaksi.paket.kendaraan.tipe_kendaraan}
                      </Typography>
                      <Typography variant="body2">
                        <strong>No Polisi:</strong> {selectedTransaksi.paket.kendaraan.no_kendaraan}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <Typography variant="subtitle1" className="font-bold mb-2">
                    Wisata
                  </Typography>
                  <div className="flex items-center gap-4">
                    <Image
                      src={selectedTransaksi.paket.wisata.gambar_wisata}
                      alt={selectedTransaksi.paket.wisata.nama_wisata}
                      className="w-16 h-16 object-cover"
                      width={64}
                      height={64}
                    />
                    <div>
                      <Typography variant="body2">
                        <strong>Nama:</strong> {selectedTransaksi.paket.wisata.nama_wisata}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Lokasi:</strong> {selectedTransaksi.paket.wisata.lokasi}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Harga Tiket:</strong> {formatRupiah(selectedTransaksi.paket.wisata.harga_tiket)}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outlined" onClick={handleCloseModal}>
                  Tutup
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </Sidebar>
  );
};

export default AuthPage(TransaksiPage);
