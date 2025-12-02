package com.choccoDelight.service;

import com.choccoDelight.config.DeliveryConfig;
import com.choccoDelight.dto.CostoDeliveryDTO;
import com.choccoDelight.entity.Delivery;
import com.choccoDelight.entity.Pedido;
import com.choccoDelight.repository.DeliveryRepository;
import com.choccoDelight.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private DeliveryConfig deliveryConfig;

    public Delivery guardarDelivery(Delivery delivery) {
        Long pedidoId = delivery.getPedido().getId();
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        delivery.setPedido(pedido);
        return deliveryRepository.save(delivery);
    }

    /**
     * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine
     */
    private double calcularDistancia(double lat1, double lon1, double lat2, double lon2) {
        final int RADIO_TIERRA_KM = 6371;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return RADIO_TIERRA_KM * c;
    }

    /**
     * Calcula el costo de delivery basado en la distancia
     */
    public CostoDeliveryDTO calcularCostoDelivery(Double latitud, Double longitud) {
        if (latitud == null || longitud == null) {
            return new CostoDeliveryDTO(
                BigDecimal.ZERO,
                0.0,
                false,
                "Coordenadas inválidas"
            );
        }

        double latHeladeria = deliveryConfig.getHeladeria().getLatitud();
        double lonHeladeria = deliveryConfig.getHeladeria().getLongitud();

        double distanciaKm = calcularDistancia(latHeladeria, lonHeladeria, latitud, longitud);
        int radioMaximo = deliveryConfig.getRadio().getMaximoKm();

        if (distanciaKm > radioMaximo) {
            return new CostoDeliveryDTO(
                BigDecimal.ZERO,
                distanciaKm,
                false,
                "La dirección está fuera del área de entrega (máximo " + radioMaximo + " km)"
            );
        }

        BigDecimal precioBase = deliveryConfig.getPrecio().getBase();
        BigDecimal precioPorKm = deliveryConfig.getPrecio().getPorKm();
        BigDecimal distanciaDecimal = BigDecimal.valueOf(distanciaKm);

        BigDecimal costoTotal = precioBase.add(precioPorKm.multiply(distanciaDecimal));
        costoTotal = costoTotal.setScale(2, RoundingMode.HALF_UP);

        return new CostoDeliveryDTO(
            costoTotal,
            distanciaKm,
            true,
            String.format("Costo de delivery calculado para %.2f km", distanciaKm)
        );
    }
}
