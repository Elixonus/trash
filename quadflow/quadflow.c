#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char** argv)
{
  FILE* strm = stdin;
  int rows = 0;
  int cols = 0;
  int row = 0;
  int col = 0;
  for(int a = 1; a < argc; a++)
  {
    char* arg = argv[a];
    if(strcmp(arg, "-i") == 0 && argc - a > 1)
    {
      char* val = argv[++a];
      strm = fopen(val, "r");
    }
    else if(strcmp(arg, "-m") == 0 && argc - a > 1)
    {
      char* val = argv[++a];
      sscanf(val, "%dx%d", &cols, &rows);
    }
    else if(strcmp(arg, "-p") == 0 && argc - a > 1)
    {
      char* val = argv[++a];
      sscanf(val, "%d,%d", &col, &row);
      row--;
      col--;
    }
  }
  char dirs[rows][cols];
  for(int r = 0; r < rows; r++)
  {
    for(int c = 0; c < cols; c++)
    {
      fscanf(strm, " %c", &dirs[r][c]);
    }
  }
  while(1)
  {
    char dir = dirs[row][col];
    if(dir == '<' && col > 0)
    {
      col--;
    }
    else if(dir == '>' && col < cols - 1)
    {
      col++;
    }
    else if(dir == '^' && row > 0)
    {
      row--;
    }
    else if(dir == 'v' && row < rows - 1)
    {
      row++;
    }
    printf("\n\npos=(%d,%d)\n", row + 1, col + 1);
    printf("+");
    for(int c = 0; c < cols; c++)
    {
      printf("-");
    }
    printf("+\n");
    for(int r = 0; r < rows; r++)
    {
      printf("|");
      for(int c = 0; c < cols; c++)
      {
        if(r == row && c == col)
        {
          printf("o");
        }
        else
        {
          printf("%c", dirs[r][c]);
        }
      }
      printf("|\n");
    }
    printf("+");
    for(int c = 0; c < cols; c++)
    {
      printf("-");
    }
    printf("+\n");
    fflush(stdout);
    sleep(1);
  }
}
