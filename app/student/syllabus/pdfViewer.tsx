import React, { useState } from "react";
import { View, ActivityIndicator, TouchableOpacity, Dimensions } from "react-native";
// import Pdf from "react-native-pdf";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Typography } from "@/components/Typography"; // your custom component
import * as Linking from "expo-linking";

interface PDFViewerProps {
  pdfUrl: string;
  height?: number;
}

const PDFViewer = ({ pdfUrl, height: viewerHeight = 400 }: PDFViewerProps) => {
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);

  const handleOpenExternal = () => {
    Linking.openURL(pdfUrl);
  };

  const source = { uri: pdfUrl, cache: true };

  return (
    <View
      style={{
        height: viewerHeight,
        borderRadius: 12,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E0E0E0",
      }}
    >
      {pdfLoading && !pdfError && (
        <View
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#F8F9FA",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <ActivityIndicator size="large" color="#6A5ACD" />
          <Typography className="text-[#7F8C8D] mt-2">Loading PDF...</Typography>
        </View>
      )}

      {pdfError ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F8F9FA" }}>
          <Icon name="error-outline" size={48} color="#E74C3C" />
          <Typography className="text-lg font-bold text-[#E74C3C] mt-4 mb-2">
            Failed to Load PDF
          </Typography>
          <Typography className="text-sm text-[#7F8C8D] text-center px-4 mb-4">
            The PDF viewer encountered an error. Try opening in an external app.
          </Typography>
          <TouchableOpacity
            onPress={handleOpenExternal}
            style={{
              backgroundColor: "#6A5ACD",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 12,
            }}
          >
            <Typography className="text-white font-semibold">Open Externally</Typography>
          </TouchableOpacity>
        </View>
      ) : (
        // <Pdf
        //   source={source}
        //   style={{ flex: 1, width: Dimensions.get("window").width }}
        //   onLoadComplete={() => setPdfLoading(false)}
        //   onError={(error:any) => {
        //     console.error(error);
        //     setPdfLoading(false);
        //     setPdfError(true);
        //   }}
        // />
        null
      )}
    </View>
  );
};

export default PDFViewer;
