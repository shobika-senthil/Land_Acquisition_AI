import { PARCELS_DATA } from '../data/parcels';
import { Parcel } from '../types';

export const parcelService = {

  getAllParcels(): Parcel[] {
    return PARCELS_DATA;
  },

  getParcelById(
    id: string
  ): Parcel | undefined {

    return PARCELS_DATA.find(
      p =>
        p.id === id ||
        p.plotId === id ||
        p.surveyNumber === id
    );
  },

  getParcelsByProject(
    projectId: string
  ): Parcel[] {

    return PARCELS_DATA.filter(
      p =>
        p.projectId === projectId
    );
  },

  getParcelsNearPoint(
    center: [number, number],
    radiusKm: number
  ): Parcel[] {

    const [cLat, cLng] = center;

    return PARCELS_DATA.filter(
      parcel => {

        const [pLat, pLng] =
          parcel.coordinates;

        const dLat =
          (pLat - cLat) * 111;

        const dLng =
          (pLng - cLng) *
          111 *
          Math.cos(
            (cLat * Math.PI) / 180
          );

        const distance =
          Math.sqrt(
            dLat * dLat +
            dLng * dLng
          );

        return (
          distance <= radiusKm + 3
        );
      }
    );
  },

};