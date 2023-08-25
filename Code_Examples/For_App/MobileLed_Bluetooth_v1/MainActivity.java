package br.com.local.mobileled_bt;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.io.IOException;
import java.io.OutputStream;
import java.util.UUID;

public class MainActivity extends AppCompatActivity {

    private static final int REQUEST_BLUETOOTH_PERMISSION = 1;
    private BluetoothAdapter bluetoothAdapter;
    private BluetoothSocket bluetoothSocket;
    private OutputStream outputStream;
    private boolean isConnected = false;

    private Button buttonConnect;
    private Button buttonLedOn;
    private Button buttonLedOff;

    private static final String DEVICE_ADDRESS = "XX:XX:XX:XX:XX:XX"; // ESP32 Bluetooth Address
    private static final UUID UUID_BT = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        buttonConnect = findViewById(R.id.buttonConnect);
        buttonLedOn = findViewById(R.id.buttonLedOn);
        buttonLedOff = findViewById(R.id.buttonLedOff);

        // Verificar a permissão BLUETOOTH_CONNECT em tempo de execução
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT)
                != PackageManager.PERMISSION_GRANTED) {
            // Permissão ainda não concedida, solicite-a ao usuário
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.BLUETOOTH_CONNECT},
                    REQUEST_BLUETOOTH_PERMISSION);
        } else {
            // Permissão já concedida, continue com a inicialização do Bluetooth
            initializeBluetooth();
        }

        buttonConnect.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!isConnected) {
                    connectToBluetooth();
                } else {
                    disconnectBluetooth();
                }
            }
        });

        buttonLedOn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendBluetoothData("1");
            }
        });

        buttonLedOff.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendBluetoothData("0");
            }
        });
    }

    private void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    private void initializeBluetooth() {
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (bluetoothAdapter == null) {
            showToast("Bluetooth not supported on this device.");
            finish();
            return;
        }
    }

    private void connectToBluetooth() {
        BluetoothDevice device = bluetoothAdapter.getRemoteDevice(DEVICE_ADDRESS);

        try {
            bluetoothSocket = device.createRfcommSocketToServiceRecord(UUID_BT);
            bluetoothSocket.connect();
            outputStream = bluetoothSocket.getOutputStream();
            isConnected = true;

            showToast("Connected to ESP32 via Bluetooth.");
            buttonConnect.setText("Disconnect");
            buttonLedOn.setEnabled(true);
            buttonLedOff.setEnabled(true);
        } catch (IOException e) {
            e.printStackTrace();
            showToast("Failed to connect to ESP32 via Bluetooth.");
        } catch (SecurityException e) {
            e.printStackTrace();
            showToast("Bluetooth permission not granted.");
        }
    }

    private void disconnectBluetooth() {
        try {
            bluetoothSocket.close();
            isConnected = false;

            showToast("Disconnected from ESP32.");
            buttonConnect.setText("Connect to ESP32");
            buttonLedOn.setEnabled(false);
            buttonLedOff.setEnabled(false);
        } catch (IOException e) {
            e.printStackTrace();
            showToast("Error disconnecting from ESP32.");
        }
    }

    private void sendBluetoothData(String data) {
        if (isConnected) {
            try {
                outputStream.write(data.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
                showToast("Error sending data to ESP32.");
            }
        } else {
            showToast("Not connected to ESP32.");
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        if (requestCode == REQUEST_BLUETOOTH_PERMISSION) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permissão concedida, continue com a inicialização do Bluetooth
                initializeBluetooth();
            } else {
                // Permissão negada pelo usuário, exiba uma mensagem de erro ou solicitação
                showToast("Bluetooth permission is required to use the app.");
                finish(); // Finalize a atividade se a permissão for negada.
            }
        }

        // Chame o método da superclasse para garantir o comportamento correto
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        disconnectBluetooth();
    }
}